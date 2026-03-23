package com.hivecontrolsolutions.comestag.entrypoint.entity.rfq;

import com.hivecontrolsolutions.comestag.core.domain.model.RfqProposalDm;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record RfqProposalResponse(
        UUID id,
        UUID rfqId,
        UUID organizationId,
        String proposalText,
        BigDecimal price,
        String currency,
        String deliveryTime,
        String status,
        Instant submittedAt,
        Instant updatedAt
) {
    public static RfqProposalResponse from(RfqProposalDm dm) {
        return new RfqProposalResponse(
                dm.getId(),
                dm.getRfqId(),
                dm.getOrganizationId(),
                dm.getProposalText(),
                dm.getPrice(),
                dm.getCurrency(),
                dm.getDeliveryTime(),
                dm.getStatus().name(),
                dm.getSubmittedAt(),
                dm.getUpdatedAt()
        );
    }
}
