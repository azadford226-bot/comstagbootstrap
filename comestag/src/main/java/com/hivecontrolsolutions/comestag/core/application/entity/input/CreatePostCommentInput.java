package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.util.UUID;

@Builder
public record CreatePostCommentInput(
        UUID postId,
        UUID accountId,
        String body,
        UUID parentCommentId
) {}