package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.service.NotificationPreferenceService;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationEnvelopeDm;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationSettingsDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationCommandPort;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationSettingsPort;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationStreamPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OutboxProcessingPort;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.Map;

@UseCase
@RequiredArgsConstructor
public class ProcessOutboxEventsUseCase implements Usecase<Integer, Integer> {

    private final OutboxProcessingPort outboxPort;
    private final NotificationSettingsPort settingsPort;
    private final NotificationCommandPort commandPort;
    private final NotificationStreamPort streamPort;

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

    private static long backoffSeconds(int attempt) {
        // 5s, 15s, 45s, 2m, 5m, 10m (cap)
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
        // payload stored exactly as envelope fields
        return new NotificationEnvelopeDm(
                java.util.UUID.fromString(payload.get("recipientAccountId").toString()),
                type,
                payload.get("actorAccountId") == null ? null : java.util.UUID.fromString(payload.get("actorAccountId").toString()),
                (String) payload.get("targetKind"),
                payload.get("targetId") == null ? null : java.util.UUID.fromString(payload.get("targetId").toString()),
                (Map<String, Object>) payload.getOrDefault("payload", java.util.Map.of()),
                (String) payload.get("dedupeKey")
        );
    }
}