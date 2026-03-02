package com.hivecontrolsolutions.comestag.entrypoint.entity.rfq;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record CreateRfqRequest(
        @NotBlank String title,
        @NotBlank String description,
        String category,
        Long industryId,
        BigDecimal budget,
        String budgetCurrency,
        Instant deadline,
        String requirements,
        @NotNull String visibility, // "PUBLIC", "INVITE_ONLY", "PRIVATE"
        List<UUID> invitedOrganizationIds,
        List<UUID> mediaIds
) {}


