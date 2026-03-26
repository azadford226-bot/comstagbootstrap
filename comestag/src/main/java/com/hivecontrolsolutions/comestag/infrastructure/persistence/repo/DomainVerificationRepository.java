package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.DomainVerificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DomainVerificationRepository extends JpaRepository<DomainVerificationEntity, UUID> {

    List<DomainVerificationEntity> findByOrgId(UUID orgId);

    Optional<DomainVerificationEntity> findByOrgIdAndDomain(UUID orgId, String domain);
}
