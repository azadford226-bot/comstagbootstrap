package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Builder
public record CreateEventInput(
        UUID orgId,
        String title,
        String body,
        Long industry,
        String country,
        String state,
        String city,
        String address,
        OffsetDateTime startAt,
        OffsetDateTime endAt,
        String onlineLink,
        boolean online,
        Set<UUID> mediaIds
) {
}