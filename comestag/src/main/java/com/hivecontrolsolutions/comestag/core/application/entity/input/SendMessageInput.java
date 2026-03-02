package com.hivecontrolsolutions.comestag.core.application.entity.input;

import lombok.Builder;

import java.util.UUID;

@Builder
public record SendMessageInput(
        UUID conversationId,
        UUID senderId,
        UUID recipientId,
        String content
) {}
