package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.UUID;

@Builder
public record SubmitProposalInput(
        UUID rfqId,
        UUID organizationId,
        String proposalText,
        BigDecimal price,
        String currency,
        String deliveryTime
) {}


