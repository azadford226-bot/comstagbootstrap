package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.core.domain.port.OutboxPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OutboxProcessingPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OutboxEventEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.OutboxEventJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OutboxPersistenceAdapter implements OutboxPort, OutboxProcessingPort {

    private final OutboxEventJpaRepository repo;

    @Override
    @Transactional
    public void enqueue(String eventType, Map<String, Object> payload) {
        OutboxEventEntity e = new OutboxEventEntity();
        e.setId(UUID.randomUUID());
        e.setEventType(eventType);
        e.setPayload(payload);
        e.setStatus("PENDING");
        e.setAttemptCount(0);
        e.setNextRetryAt(null);
        e.setCreatedAt(Instant.now());
        e.setUpdatedAt(Instant.now());
        repo.save(e);
    }

    @Override
    @Transactional
    public List<OutboxEventRow> lockNextPending(int limit) {
        List<OutboxEventEntity> locked = repo.lockNextPending(limit);

        for (OutboxEventEntity e : locked) {
            e.setStatus("PROCESSING");
            e.setUpdatedAt(Instant.now());
        }
        repo.saveAll(locked);

        List<OutboxEventRow> rows = new ArrayList<>();
        for (OutboxEventEntity e : locked) {
            rows.add(new OutboxEventRow(e.getId(), e.getEventType(), e.getPayload(), e.getAttemptCount()));
        }
        return rows;
    }

    @Override
    @Transactional
    public void markProcessed(UUID id) {
        repo.findById(id).ifPresent(e -> {
            e.setStatus("PROCESSED");
            e.setUpdatedAt(Instant.now());
            repo.save(e);
        });
    }

    // retry by setting back to PENDING + next_retry_at
    @Override
    @Transactional
    public void markFailed(UUID id, int newAttemptCount, Instant nextRetryAt, String error) {
        repo.findById(id).ifPresent(e -> {
            e.setStatus("PENDING");          // so lockNextPending picks it up later
            e.setAttemptCount(newAttemptCount);
            e.setNextRetryAt(nextRetryAt);
            e.setUpdatedAt(Instant.now());
            repo.save(e);
        });
    }
}
