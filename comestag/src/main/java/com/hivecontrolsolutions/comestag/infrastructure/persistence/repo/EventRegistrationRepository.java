package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.EventRegistrationStatus;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.EventRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EventRegistrationRepository extends JpaRepository<EventRegistrationEntity, UUID> {

    Optional<EventRegistrationEntity> findByEventIdAndAccountId(UUID eventId, UUID accountId);

    boolean existsByEventIdAndAccountIdAndStatus(UUID eventId,
                                                 UUID accountId,
                                                 EventRegistrationStatus status);
}