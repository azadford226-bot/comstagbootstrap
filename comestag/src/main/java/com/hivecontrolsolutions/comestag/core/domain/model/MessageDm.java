package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class MessageDm {
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private String content;
    private boolean read;
    private Instant readAt;
    private Instant createdAt;
    private Instant updatedAt;
}
