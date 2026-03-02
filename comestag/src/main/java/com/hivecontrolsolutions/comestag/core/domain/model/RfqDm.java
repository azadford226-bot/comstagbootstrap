package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Value
@Builder
public class RfqDm {
    UUID id;
    UUID organizationId;
    String title;
    String description;
    String category;
    Long industryId;
    BigDecimal budget;
    String budgetCurrency;
    Instant deadline;
    String requirements;
    RfqStatus status;
    RfqVisibility visibility;
    UUID awardedToId;
    Instant createdAt;
    Instant updatedAt;
    List<UUID> invitedOrganizationIds;
    List<UUID> mediaIds;
    
    public enum RfqStatus {
        OPEN, CLOSED, AWARDED, CANCELLED
    }
    
    public enum RfqVisibility {
        PUBLIC, INVITE_ONLY, PRIVATE
    }
}


