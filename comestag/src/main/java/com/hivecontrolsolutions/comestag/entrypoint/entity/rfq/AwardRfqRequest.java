package com.hivecontrolsolutions.comestag.entrypoint.entity.rfq;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AwardRfqRequest(
        @NotNull UUID rfqId,
        @NotNull UUID awardedToOrganizationId
) {}


