package com.hivecontrolsolutions.comestag.core.domain.model;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.NotificationType;

import java.util.Map;
import java.util.UUID;

public record NotificationEnvelopeDm(
        UUID recipientAccountId,
        NotificationType type,
        UUID actorAccountId,
        String targetKind,
        UUID targetId,
        Map<String, Object> payload,
        String dedupeKey
) {
}