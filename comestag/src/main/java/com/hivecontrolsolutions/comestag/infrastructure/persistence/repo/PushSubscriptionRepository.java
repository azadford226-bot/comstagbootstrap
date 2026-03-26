package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PushSubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PushSubscriptionRepository extends JpaRepository<PushSubscriptionEntity, UUID> {

    List<PushSubscriptionEntity> findByAccountId(UUID accountId);

    void deleteByAccountIdAndEndpoint(UUID accountId, String endpoint);
}
