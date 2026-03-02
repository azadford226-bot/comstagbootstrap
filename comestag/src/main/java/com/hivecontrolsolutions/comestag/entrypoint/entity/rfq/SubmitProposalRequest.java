package com.hivecontrolsolutions.comestag.entrypoint.entity.rfq;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.UUID;

public record SubmitProposalRequest(
        @NotNull UUID rfqId,
        @NotBlank String proposalText,
        @NotNull @Positive BigDecimal price,
        String currency,
        String deliveryTime
) {}


