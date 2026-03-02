package com.hivecontrolsolutions.comestag.entrypoint.stream.message;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MessageSseHeartbeatScheduler {

    private final MessageSseRegistry registry;

    @Scheduled(fixedDelay = 25000) // keep connections alive (25 seconds)
    public void heartbeat() {
        registry.heartbeatAll();
    }
}
