package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.util.UUID;

@Builder
public record AwardRfqInput(
        UUID rfqId,
        UUID ownerOrganizationId,
        UUID awardedToOrganizationId
) {}


