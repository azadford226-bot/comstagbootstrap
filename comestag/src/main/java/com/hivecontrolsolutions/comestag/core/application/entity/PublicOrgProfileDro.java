package com.hivecontrolsolutions.comestag.core.application.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.hivecontrolsolutions.comestag.core.domain.model.IndustryDm;
import lombok.Builder;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record PublicOrgProfileDro(
        UUID id,
        String displayName,
        IndustryDm industry,
        LocalDate established,
        String website,
        String size,
        String whoWeAre,
        String whatWeDo,
        long reviewsCount,
        long ratingSum,
        String country,
        String state,
        String city,
        UUID profileImageId,
        UUID profileCoverId,
        Instant createdAt
) {
}
