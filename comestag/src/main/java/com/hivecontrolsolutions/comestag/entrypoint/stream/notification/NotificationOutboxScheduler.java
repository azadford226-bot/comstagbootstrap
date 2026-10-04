package com.hivecontrolsolutions.comestag.entrypoint.stream.notification;

import com.hivecontrolsolutions.comestag.core.application.usecase.notification.ProcessOutboxEventsUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationOutboxScheduler {

    private final ProcessOutboxEventsUseCase processUseCase;

    @Async
    @Scheduled(fixedRate = 1000)
    public void tick() {
        processUseCase.execute(50);
    }
}