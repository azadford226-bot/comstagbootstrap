package com.hivecontrolsolutions.comestag.entrypoint.entity.event;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

public record UpdateEventRequest(
        String title,
        String body,
        Long industryId,
        String country,
        String state,
        String city,
        String address,
        OffsetDateTime startAt,
        OffsetDateTime endAt,
        Boolean online,     // nullable
        String onlineLink,
        Set<UUID> deletedMediaIds,
        Set<UUID> newMediaIds
) {
}
