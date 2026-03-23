package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.NotificationPreferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreferenceEntity, UUID> {
    Optional<NotificationPreferenceEntity> findByAccountId(UUID accountId);
}
