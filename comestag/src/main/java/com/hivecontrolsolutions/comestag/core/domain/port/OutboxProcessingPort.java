package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface OutboxProcessingPort {

    record OutboxEventRow(
            UUID id,
            String eventType,
            Map<String, Object> payload,
            int attemptCount
    ) {
    }

    List<OutboxEventRow> lockNextPending(int limit);

    void markProcessed(UUID id);

    void markFailed(UUID id, int newAttemptCount, java.time.Instant nextRetryAt, String error);
}