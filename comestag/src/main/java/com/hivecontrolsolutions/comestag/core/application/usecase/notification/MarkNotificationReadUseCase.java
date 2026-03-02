package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationCommandPort;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class MarkNotificationReadUseCase implements UsecaseWithoutOutput<MarkNotificationReadUseCase.Input> {

    private final NotificationCommandPort commandPort;

    @Override
    public void execute(Input input) {
        commandPort.markRead(input.accountId(), input.notificationId(), Instant.now());
    }

    public record Input(UUID accountId, UUID notificationId) {}
}
