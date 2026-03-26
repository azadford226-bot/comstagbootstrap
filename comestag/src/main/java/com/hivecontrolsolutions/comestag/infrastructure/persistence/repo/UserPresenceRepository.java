package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.UserPresenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface UserPresenceRepository extends JpaRepository<UserPresenceEntity, UUID> {

    @Modifying
    @Query("UPDATE UserPresenceEntity p SET p.lastSeen = :now, p.online = true WHERE p.accountId = :id")
    void heartbeat(@Param("id") UUID id, @Param("now") Instant now);

    @Modifying
    @Query("UPDATE UserPresenceEntity p SET p.online = false WHERE p.lastSeen < :threshold")
    void markStale(@Param("threshold") Instant threshold);

    List<UserPresenceEntity> findByAccountIdIn(List<UUID> ids);
}
