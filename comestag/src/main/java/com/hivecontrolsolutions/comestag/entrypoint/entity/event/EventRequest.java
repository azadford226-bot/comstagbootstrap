package com.hivecontrolsolutions.comestag.entrypoint.entity.event;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

public record EventRequest(
        @NotBlank String title,
        String body,
        // optional override; if null, we can default from org industry in usecase
        Long industry,
        String country,
        String state,
        String city,
        String address,
        @NotNull OffsetDateTime startAt,
        OffsetDateTime endAt,
        boolean online,
        String onlineLink,
        Set<UUID> mediaIds
) {
}
