package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.AnalyticsEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AnalyticsEventRepository extends JpaRepository<AnalyticsEventEntity, UUID> {

    @Query("SELECT DATE(e.createdAt) as date, COUNT(e) as count " +
           "FROM AnalyticsEventEntity e " +
           "WHERE e.accountId = :accountId AND e.eventType = :eventType AND e.createdAt >= :since " +
           "GROUP BY DATE(e.createdAt) ORDER BY DATE(e.createdAt)")
    List<Object[]> countByDateRange(@Param("accountId") UUID accountId,
                                    @Param("eventType") String eventType,
                                    @Param("since") Instant since);

    long countByAccountIdAndEventType(UUID accountId, String eventType);
}
