package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
public class ConversationDm {
    private UUID id;
    private UUID participant1Id;
    private UUID participant2Id;
    private UUID lastMessageId;
    private Instant lastMessageTime;
    private Instant createdAt;
    private Instant updatedAt;
}
