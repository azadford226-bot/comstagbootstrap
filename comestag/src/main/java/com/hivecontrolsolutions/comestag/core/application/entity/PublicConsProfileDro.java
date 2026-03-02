package com.hivecontrolsolutions.comestag.core.application.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hivecontrolsolutions.comestag.core.domain.model.IndustryDm;
import lombok.Builder;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PublicConsProfileDro(
        UUID id,
        String displayName,
        IndustryDm industry,
        LocalDate established,
        String size,
        String website,
        String country,
        String state,
        String city,
        UUID profileImageId,
        UUID profileCoverId,
        Instant createdAt
) {
}
