package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Builder
public record UpdateEventInput(
        UUID orgId,
        UUID eventId,
        String title,
        String body,
        Long industry,
        String country,
        String state,
        String city,
        String address,
        OffsetDateTime startAt,
        OffsetDateTime endAt,
        Boolean online,            // nullable -> keep as is
        String onlineLink,
        Set<UUID> deletedMediaIds,
        Set<UUID> newMediaIds
) {
}
