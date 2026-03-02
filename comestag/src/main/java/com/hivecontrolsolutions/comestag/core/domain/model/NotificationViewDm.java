package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Getter
@Builder
public class NotificationViewDm {
    private UUID notificationId;
    private String type;
    private Instant createdAt;

    private UUID actorAccountId;
    private String targetKind;
    private UUID targetId;

    private Map<String, Object> payload;
    private Instant readAt;
}