package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "subscriptions")
public class SubscriptionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "account_id", nullable = false, unique = true)
    private UUID accountId;

    @Column(name = "stripe_customer_id", nullable = false, unique = true)
    private String stripeCustomerId;

    @Column(name = "stripe_subscription_id", unique = true)
    private String stripeSubscriptionId;

    @Column(nullable = false)
    private String status;

    @Column(name = "trial_ends_at")
    private Instant trialEndsAt;

    @Column(name = "current_period_ends_at")
    private Instant currentPeriodEndsAt;

    @Column(name = "cancel_at_period_end", nullable = false)
    private boolean cancelAtPeriodEnd;

    @Column(name = "created_at", insertable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", insertable = false)
    private Instant updatedAt;
}