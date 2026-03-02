package com.hivecontrolsolutions.comestag.core.domain.model;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Builder
@Getter
public class NotificationDm {
    private UUID id;
    private NotificationType type;
    private UUID actorAccountId;
    private String targetKind; // "POST", "EVENT", ...
    private UUID targetId;
    private Map<String, Object> payload;
    private Instant createdAt;
}
