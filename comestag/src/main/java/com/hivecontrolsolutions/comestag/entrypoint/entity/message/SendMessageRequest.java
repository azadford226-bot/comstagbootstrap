package com.hivecontrolsolutions.comestag.entrypoint.entity.message;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record SendMessageRequest(
        UUID conversationId, // Optional - will create new conversation if not provided
        UUID recipientId, // Required only if conversationId is not provided
        @NotBlank String content
) {}
