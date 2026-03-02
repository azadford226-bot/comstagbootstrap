package com.hivecontrolsolutions.comestag.core.application.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hivecontrolsolutions.comestag.core.domain.model.IndustryDm;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record PrivateConsProfileDto(
        IndustryDm industry,
        Set<String> interests,
        LocalDate established,
        String size,
        String website,
        String phone,
        String country,
        String state,
        String city,
        int views,
        UUID profileImageId,
        UUID profileCoverId,
        Instant createdAt,
        Instant updatedAt
) {
}
