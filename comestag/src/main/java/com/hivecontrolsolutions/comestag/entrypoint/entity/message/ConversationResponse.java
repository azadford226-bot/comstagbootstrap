package com.hivecontrolsolutions.comestag.entrypoint.entity.message;

import java.time.Instant;
import java.util.UUID;

public record ConversationResponse(
        UUID id,
        UUID otherUserId,
        String otherUserName,
        String otherUserType, // "ORGANIZATION" or "CONSUMER"
        String lastMessage,
        Instant lastMessageTime,
        UUID lastMessageSenderId,
        long unreadCount,
        Instant createdAt,
        Instant updatedAt
) {}
