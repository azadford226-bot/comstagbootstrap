package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.CapabilityHashtagEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.CapabilityHashtagId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Set;
import java.util.UUID;

public interface CapabilityHashtagRepository extends JpaRepository<CapabilityHashtagEntity, CapabilityHashtagId> {

    @Modifying
    @Query("""
            DELETE FROM CapabilityHashtagEntity c
            WHERE c.id.capabilityId = :capabilityId
              AND c.id.hashtagId IN :hashtagIds
            """)
    int deleteByCapabilityIdAndHashtagIdIn(@Param("capabilityId") UUID capabilityId,
                                           @Param("hashtagIds") Set<Long> hashtagIds);
}