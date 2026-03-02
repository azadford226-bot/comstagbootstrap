package com.hivecontrolsolutions.comestag.entrypoint.stream.notification;

import com.hivecontrolsolutions.comestag.core.application.usecase.notification.ProcessOutboxEventsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationOutboxScheduler {

    private final ProcessOutboxEventsUseCase processUseCase;

    @Scheduled(fixedDelay = 1000) // 1s; adjust later
    public void tick() {
        processUseCase.execute(50);
    }
}