package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.service.NotificationPreferenceService;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationEnvelopeDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationPreferenceDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType;
import com.hivecontrolsolutions.comestag.core.domain.port.*;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import com.hivecontrolsolutions.comestag.core.domain.service.NotificationTypeCategoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
@Slf4j
public class ProcessOutboxEventsUseCase implements Usecase<Integer, Integer> {

    private final OutboxProcessingPort outboxPort;
    private final NotificationSettingsPort settingsPort;
    private final NotificationCommandPort commandPort;
    private final NotificationStreamPort streamPort;
    private final NotificationPreferencePort preferencePort;
    private final AccountPort accountPort;
    private final EmailNotification emailNotification;

    private final NotificationPreferenceService preferenceService = new NotificationPreferenceService();

    @Override
    public Integer execute(Integer batchsize) {
        var rows = outboxPort.lockNextPending(batchsize);
        int processed = 0;

        for (var row : rows) {
            try {
                NotificationType type = NotificationType.valueOf(row.eventType());
                NotificationEnvelopeDm envelope = mapPayloadToEnvelope(type, row.payload());

                NotificationSettingsDm settings = settingsPort.getOrCreateDefault(envelope.recipientAccountId());
                if (!preferenceService.isInAppEnabled(settings, type)) {
                    outboxPort.markProcessed(row.id());
                    processed++;
                    continue;
                }

                commandPort.createInAppIfAllowedAndNotDuplicated(envelope)
                        .ifPresent(created -> streamPort.emitCreated(envelope.recipientAccountId(), created));

                // Dispatch email notification if user preferences allow
                dispatchEmailIfEnabled(type, envelope);

                outboxPort.markProcessed(row.id());
                processed++;

            } catch (Exception ex) {
                int nextAttempt = row.attemptCount() + 1;
                Instant nextRetry = Instant.now().plusSeconds(backoffSeconds(nextAttempt));
                outboxPort.markFailed(row.id(), nextAttempt, nextRetry, safeMsg(ex));
            }
        }

        return processed;
    }

    private void dispatchEmailIfEnabled(NotificationType type, NotificationEnvelopeDm envelope) {
        try {
            NotificationPreferenceDm prefs = preferencePort.findByAccountId(envelope.recipientAccountId()).orElse(null);
            // Only send immediate emails; digest users are handled by the digest scheduler
            if (prefs == null || !"immediate".equals(prefs.getEmailDigest())) return;
            if (!NotificationTypeCategoryMapper.isCategoryEnabled(prefs, type)) return;

            AccountDm recipient = accountPort.getById(envelope.recipientAccountId()).orElse(null);
            if (recipient == null || recipient.getEmail() == null) return;

            AccountDm actor = envelope.actorAccountId() != null
                    ? accountPort.getById(envelope.actorAccountId()).orElse(null) : null;
            String actorName = actor != null ? actor.getDisplayName() : "Someone";
            String recipientName = recipient.getDisplayName();

            Map<String, Object> innerPayload = envelope.payload();

            switch (type) {
                case RFQ_NEW -> {
                    String rfqTitle = innerPayload != null ? String.valueOf(innerPayload.getOrDefault("rfqTitle", "")) : "";
                    emailNotification.sendRfqNewEmail(recipientName, recipient.getEmail(), actorName, rfqTitle);
                }
                case RFQ_BID -> {
                    String rfqTitle = innerPayload != null ? String.valueOf(innerPayload.getOrDefault("rfqTitle", "your RFQ")) : "your RFQ";
                    emailNotification.sendRfqBidEmail(recipientName, recipient.getEmail(), actorName, rfqTitle);
                }
                case RFQ_AWARDED -> {
                    String rfqTitle = innerPayload != null ? String.valueOf(innerPayload.getOrDefault("rfqTitle", "an RFQ")) : "an RFQ";
                    emailNotification.sendRfqAwardedEmail(recipientName, recipient.getEmail(), actorName, rfqTitle);
                }
                case MESSAGE_NEW ->
                    emailNotification.sendMessageNewEmail(recipientName, recipient.getEmail(), actorName);
                case FOLLOW ->
                    emailNotification.sendFollowEmail(recipientName, recipient.getEmail(), actorName);
                case OPPORTUNITY_INTEREST -> {
                    String oppTitle = innerPayload != null ? String.valueOf(innerPayload.getOrDefault("opportunityTitle", "your opportunity")) : "your opportunity";
                    emailNotification.sendOpportunityInterestEmail(recipientName, recipient.getEmail(), actorName, oppTitle);
                }
                case POST_COMMENTED, POST_REACTED -> {
                    // Social events — email only for immediate digest users
                    // These are high-frequency, so we keep them as in-app + SSE only by default
                }
                default -> { /* no email for other types */ }
            }
        } catch (Exception emailEx) {
            log.warn("Email dispatch failed for notification {}: {}", type, emailEx.getMessage());
        }
    }

    private static long backoffSeconds(int attempt) {
        return switch (attempt) {
            case 1 -> 5;
            case 2 -> 15;
            case 3 -> 45;
            case 4 -> 120;
            case 5 -> 300;
            default -> 600;
        };
    }

    private static String safeMsg(Exception ex) {
        String m = ex.getMessage();
        if (m == null) return ex.getClass().getSimpleName();
        return m.length() > 800 ? m.substring(0, 800) : m;
    }

    @SuppressWarnings("unchecked")
    private static NotificationEnvelopeDm mapPayloadToEnvelope(NotificationType type, Map<String, Object> payload) {
        return new NotificationEnvelopeDm(
                UUID.fromString(payload.get("recipientAccountId").toString()),
                type,
                payload.get("actorAccountId") == null ? null : UUID.fromString(payload.get("actorAccountId").toString()),
                (String) payload.get("targetKind"),
                payload.get("targetId") == null ? null : UUID.fromString(payload.get("targetId").toString()),
                (Map<String, Object>) payload.getOrDefault("payload", Map.of()),
                (String) payload.get("dedupeKey")
        );
    }
}
