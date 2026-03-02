package com.hivecontrolsolutions.comestag.entrypoint.entity.message;

import java.time.Instant;
import java.util.UUID;

public record MessageResponse(
        UUID id,
        UUID conversationId,
        UUID senderId,
        String senderName,
        String content,
        Instant timestamp,
        boolean read,
        Instant readAt
) {}
