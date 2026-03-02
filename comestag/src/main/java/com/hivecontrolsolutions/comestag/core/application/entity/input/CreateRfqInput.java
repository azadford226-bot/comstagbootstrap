package com.hivecontrolsolutions.comestag.core.application.entity.input;

import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Builder
public record CreateRfqInput(
        UUID organizationId,
        String title,
        String description,
        String category,
        Long industryId,
        BigDecimal budget,
        String budgetCurrency,
        Instant deadline,
        String requirements,
        RfqDm.RfqVisibility visibility,
        List<UUID> invitedOrganizationIds,
        List<UUID> mediaIds
) {}


