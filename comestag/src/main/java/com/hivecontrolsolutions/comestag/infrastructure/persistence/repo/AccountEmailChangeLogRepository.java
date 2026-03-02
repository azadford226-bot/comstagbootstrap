package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.AccountEmailChangeLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountEmailChangeLogRepository extends JpaRepository<AccountEmailChangeLogEntity, UUID> {

    Optional<AccountEmailChangeLogEntity> findTopByAccountIdOrderByChangedAtDesc(UUID accountId);
}

