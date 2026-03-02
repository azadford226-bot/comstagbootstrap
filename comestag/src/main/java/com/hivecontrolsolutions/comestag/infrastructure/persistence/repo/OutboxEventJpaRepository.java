package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OutboxEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface OutboxEventJpaRepository extends JpaRepository<OutboxEventEntity, UUID> {

    // NOTE: this native query uses SKIP LOCKED best practice.
    @Query(value = """
      SELECT *
      FROM outbox_events
      WHERE status = 'PENDING'
        AND (next_retry_at IS NULL OR next_retry_at <= now())
      ORDER BY created_at ASC
      LIMIT ?1
      FOR UPDATE SKIP LOCKED
      """, nativeQuery = true)
    List<OutboxEventEntity> lockNextPending(int limit);
}