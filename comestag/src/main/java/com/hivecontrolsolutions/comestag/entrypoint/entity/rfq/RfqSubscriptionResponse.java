package com.hivecontrolsolutions.comestag.entrypoint.entity.rfq;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqSubscriptionEntity;

import java.time.Instant;
import java.util.UUID;

public record RfqSubscriptionResponse(
        UUID id,
        String keyword,
        String category,
        Instant createdAt
) {
    public static RfqSubscriptionResponse from(RfqSubscriptionEntity entity) {
        return new RfqSubscriptionResponse(
                entity.getId(),
                entity.getKeyword(),
                entity.getCategory(),
                entity.getCreatedAt()
        );
    }
}
