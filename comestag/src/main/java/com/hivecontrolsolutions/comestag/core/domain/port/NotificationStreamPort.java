package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;

import java.util.UUID;

public interface NotificationStreamPort {
    void emitCreated(UUID recipientAccountId, NotificationViewDm notification);
}