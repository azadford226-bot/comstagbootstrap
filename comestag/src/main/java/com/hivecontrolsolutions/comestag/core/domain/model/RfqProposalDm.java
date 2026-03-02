package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Value
@Builder
public class RfqProposalDm {
    UUID id;
    UUID rfqId;
    UUID organizationId;
    String proposalText;
    BigDecimal price;
    String currency;
    String deliveryTime;
    ProposalStatus status;
    Instant submittedAt;
    Instant updatedAt;
    
    public enum ProposalStatus {
        SUBMITTED, SHORTLISTED, ACCEPTED, REJECTED
    }
}


