package com.hivecontrolsolutions.comestag.entrypoint.web.billing;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.infrastructure.config.StripeBillingProperties;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SubscriptionEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.AccountRepository;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.SubscriptionRepository;
import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.Event;
import com.stripe.model.Subscription;
import com.stripe.net.Webhook;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/billing")
public class StripeBillingProcessor {
    private final StripeBillingProperties properties;
    private final AccountRepository accountRepository;
    private final SubscriptionRepository subscriptionRepository;

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/subscription")
    public ResponseEntity<?> getSubscription(@CurrentUserId UUID accountId) {
        return subscriptionRepository.findByAccountId(accountId)
                .<ResponseEntity<?>>map(subscription -> ResponseEntity.ok(toResponse(subscription)))
                .orElseGet(() -> ResponseEntity.ok(Map.of("status", "NONE", "configured", properties.isConfigured())));
    }

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<?> createCheckoutSession(@CurrentUserId UUID accountId) throws StripeException {
        if (!properties.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", "Billing is not configured"));
        }

        var account = accountRepository.findById(accountId).orElseThrow();
        Stripe.apiKey = properties.getSecretKey();
        SubscriptionEntity subscription = subscriptionRepository.findByAccountId(accountId).orElseGet(() -> {
            try {
                Customer customer = Customer.create(CustomerCreateParams.builder()
                        .setEmail(account.toDm().getEmail())
                        .putMetadata("accountId", accountId.toString())
                        .build());
                SubscriptionEntity created = new SubscriptionEntity();
                created.setAccountId(accountId);
                created.setStripeCustomerId(customer.getId());
                created.setStatus("CHECKOUT_CREATED");
                return subscriptionRepository.save(created);
            } catch (StripeException exception) {
                throw new StripeCheckoutException(exception);
            }
        });

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                .setCustomer(subscription.getStripeCustomerId())
                .setClientReferenceId(accountId.toString())
                .setSuccessUrl(properties.getAppBaseUrl() + "/billing?checkout=success")
                .setCancelUrl(properties.getAppBaseUrl() + "/billing?checkout=cancelled")
                .setSubscriptionData(SessionCreateParams.SubscriptionData.builder()
                        .setTrialPeriodDays(90L)
                        .putMetadata("accountId", accountId.toString())
                        .build())
                .addLineItem(SessionCreateParams.LineItem.builder()
                        .setPrice(properties.getPriceId())
                        .setQuantity(1L)
                        .build())
                .build();
        var session = com.stripe.model.checkout.Session.create(params);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("checkoutUrl", session.getUrl()));
    }

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/portal")
    public ResponseEntity<?> createCustomerPortalSession(@CurrentUserId UUID accountId) throws StripeException {
        if (!properties.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("message", "Billing is not configured"));
        }
        SubscriptionEntity subscription = subscriptionRepository.findByAccountId(accountId)
                .orElseThrow(() -> new IllegalStateException("No subscription exists for this account"));
        Stripe.apiKey = properties.getSecretKey();
        var portalSession = com.stripe.model.billingportal.Session.create(
                com.stripe.param.billingportal.SessionCreateParams.builder()
                        .setCustomer(subscription.getStripeCustomerId())
                        .setReturnUrl(properties.getAppBaseUrl() + "/billing")
                        .build());
        return ResponseEntity.ok(Map.of("portalUrl", portalSession.getUrl()));
    }

    @PostMapping("/webhook")
    @Transactional
    public ResponseEntity<Void> handleWebhook(@RequestBody String payload,
                                               @RequestHeader("Stripe-Signature") String signature) {
        if (!properties.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
        }
        try {
            Event event = Webhook.constructEvent(payload, signature, properties.getWebhookSecret());
            if (event.getType().startsWith("customer.subscription.")) {
                event.getDataObjectDeserializer().getObject()
                        .filter(Subscription.class::isInstance)
                        .map(Subscription.class::cast)
                        .ifPresent(this::persistSubscription);
            }
            return ResponseEntity.ok().build();
        } catch (SignatureVerificationException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    private void persistSubscription(Subscription stripeSubscription) {
        subscriptionRepository.findByStripeCustomerId(stripeSubscription.getCustomer())
                .ifPresent(subscription -> {
                    subscription.setStripeSubscriptionId(stripeSubscription.getId());
                    subscription.setStatus(stripeSubscription.getStatus());
                    subscription.setTrialEndsAt(toInstant(stripeSubscription.getTrialEnd()));
                    subscription.setCurrentPeriodEndsAt(toInstant(stripeSubscription.getCurrentPeriodEnd()));
                    subscription.setCancelAtPeriodEnd(Boolean.TRUE.equals(stripeSubscription.getCancelAtPeriodEnd()));
                    subscriptionRepository.save(subscription);
                });
    }

    private Map<String, Object> toResponse(SubscriptionEntity subscription) {
        return Map.of(
                "status", subscription.getStatus(),
                "trialEndsAt", subscription.getTrialEndsAt() == null ? "" : subscription.getTrialEndsAt().toString(),
                "currentPeriodEndsAt", subscription.getCurrentPeriodEndsAt() == null ? "" : subscription.getCurrentPeriodEndsAt().toString(),
                "cancelAtPeriodEnd", subscription.isCancelAtPeriodEnd(),
                "configured", properties.isConfigured());
    }

    private Instant toInstant(Long epochSeconds) {
        return epochSeconds == null ? null : Instant.ofEpochSecond(epochSeconds);
    }

    private static class StripeCheckoutException extends RuntimeException {
        StripeCheckoutException(StripeException cause) {
            super(cause);
        }
    }
}