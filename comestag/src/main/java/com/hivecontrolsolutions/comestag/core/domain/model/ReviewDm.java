package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class ReviewDm {
    private UUID id;
    private UUID reviewerId;
    private UUID reviewedOrgId;
    private int rating;
    private String title;
    private String body;
    private String engagementType;
    private Instant createdAt;
    private Instant updatedAt;
}
