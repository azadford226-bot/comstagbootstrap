package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.EventMediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.EventMediaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;
import java.util.UUID;

public interface EventMediaRepository extends JpaRepository<EventMediaEntity, EventMediaId> {

    @Modifying
    @Query("""
            DELETE FROM EventMediaEntity e
            WHERE e.id.eventId = :eventId
              AND e.id.mediaId IN :mediaIds
            """)
    int deleteByEventIdAndMediaIdIn(@Param("eventId") UUID eventId,
                                    @Param("mediaIds") Set<UUID> mediaIds);
}
