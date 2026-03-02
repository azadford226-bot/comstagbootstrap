package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.MediaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface MediaRepository extends JpaRepository<MediaEntity, UUID> {

    @Query("SELECT m FROM MediaEntity m WHERE m.ownerAccountId = :ownerAccountId AND m.id IN :ids")
    Set<MediaEntity> findIdsByOwnerAccountIdAndIdIn(UUID ownerAccountId, Set<UUID> ids);

    Optional<MediaEntity> findByIdAndOwnerAccountId(UUID uuid, UUID ownerAccountId);

    boolean existsByIdAndOwnerAccountId(UUID uuid, UUID ownerAccountId);
}

