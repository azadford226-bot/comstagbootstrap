package com.hivecontrolsolutions.comestag.entrypoint.stream.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationSseHeartbeatScheduler {

    private final NotificationSseRegistry registry;

    @Scheduled(fixedDelay = 25000) // keep connections alive
    public void heartbeat() {
        registry.heartbeatAll();
    }
}