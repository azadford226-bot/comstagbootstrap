package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SubscriptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<SubscriptionEntity, UUID> {
    Optional<SubscriptionEntity> findByAccountId(UUID accountId);

    Optional<SubscriptionEntity> findByStripeCustomerId(String stripeCustomerId);
}