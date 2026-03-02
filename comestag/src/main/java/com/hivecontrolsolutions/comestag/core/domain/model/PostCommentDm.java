package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class PostCommentDm {

    private UUID id;
    private UUID postId;
    private UUID accountId;
    private String body;
    private UUID parentCommentId;
    private Instant createdAt;
    private Instant updatedAt;
}