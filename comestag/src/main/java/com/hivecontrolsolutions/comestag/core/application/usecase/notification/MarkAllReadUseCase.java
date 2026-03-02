package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationCommandPort;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class MarkAllReadUseCase implements Usecase<MarkAllReadUseCase.Input, Integer> {

    private final NotificationCommandPort commandPort;

    @Override
    public Integer execute(Input input) {
        return commandPort.markAllRead(input.accountId(), Instant.now());
    }

    public record Input(UUID accountId) {}
}