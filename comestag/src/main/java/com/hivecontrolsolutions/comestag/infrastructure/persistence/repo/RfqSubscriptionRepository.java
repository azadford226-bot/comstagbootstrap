package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqSubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RfqSubscriptionRepository extends JpaRepository<RfqSubscriptionEntity, UUID> {

    List<RfqSubscriptionEntity> findByAccountId(UUID accountId);

    void deleteByIdAndAccountId(UUID id, UUID accountId);
}
