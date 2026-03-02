package com.hivecontrolsolutions.comestag.entrypoint.entity.rfq;

import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record RfqResponse(
        UUID id,
        UUID organizationId,
        String title,
        String description,
        String category,
        Long industryId,
        BigDecimal budget,
        String budgetCurrency,
        Instant deadline,
        String requirements,
        String status,
        String visibility,
        UUID awardedToId,
        Instant createdAt,
        Instant updatedAt,
        long proposalCount,
        boolean hasSubmitted,
        boolean isOwner
) {
    public static RfqResponse from(RfqDm rfq, long proposalCount, boolean hasSubmitted, boolean isOwner) {
        return new RfqResponse(
                rfq.getId(),
                rfq.getOrganizationId(),
                rfq.getTitle(),
                rfq.getDescription(),
                rfq.getCategory(),
                rfq.getIndustryId(),
                rfq.getBudget(),
                rfq.getBudgetCurrency(),
                rfq.getDeadline(),
                rfq.getRequirements(),
                rfq.getStatus().name(),
                rfq.getVisibility().name(),
                rfq.getAwardedToId(),
                rfq.getCreatedAt(),
                rfq.getUpdatedAt(),
                proposalCount,
                hasSubmitted,
                isOwner
        );
    }
}


