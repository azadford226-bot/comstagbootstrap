package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class TestimonialDm {
    private UUID id;
    private UUID organizationId;
    private UUID consumerId;
    private short rating;
    private String consumerName;
    private String comment;
    private Instant createdAt;
    private Instant updatedAt;
}
