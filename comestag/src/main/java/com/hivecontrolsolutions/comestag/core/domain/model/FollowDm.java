package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class FollowDm {
    private UUID id;
    private UUID followerId;
    private UUID followingId;
    private Instant createdAt;
}
