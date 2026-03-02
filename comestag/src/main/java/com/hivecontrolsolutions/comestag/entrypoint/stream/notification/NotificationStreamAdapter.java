package com.hivecontrolsolutions.comestag.entrypoint.stream.notification;

import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationStreamPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NotificationStreamAdapter implements NotificationStreamPort {
    private final NotificationSseRegistry registry;


    @Override
    public void emitCreated(UUID recipientAccountId, NotificationViewDm notification) {
        registry.emit(recipientAccountId, "notification.created", notification);
    }

}