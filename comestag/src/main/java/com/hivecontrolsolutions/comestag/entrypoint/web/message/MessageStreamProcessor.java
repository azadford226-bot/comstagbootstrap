package com.hivecontrolsolutions.comestag.entrypoint.web.message;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.entrypoint.stream.message.MessageSseRegistry;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/messages")
public class MessageStreamProcessor {

    private final MessageSseRegistry messageSseRegistry;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping(value = "/stream", produces = "text/event-stream")
    @Operation(summary = "Subscribe to real-time message events",
            description = "Establishes a Server-Sent Events (SSE) connection to receive real-time message notifications.")
    public SseEmitter stream(@CurrentUserId UUID currentUserId) {
        return messageSseRegistry.register(currentUserId);
    }
}
