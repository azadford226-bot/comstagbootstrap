package com.hivecontrolsolutions.comestag.entrypoint.entity.comment;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record CreatePostCommentRequest(
        @NotBlank String body,
        UUID parentCommentId
) {}
