package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.UUID;

@Builder
@Getter
public class NotificationRecipientDm {
    private UUID notificationId;
    private UUID recipientAccountId;
    private String dedupeKey;
    private Instant readAt;
    private Instant createdAt;
}