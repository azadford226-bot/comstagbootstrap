package com.hivecontrolsolutions.comestag.entrypoint.web.events;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.model.EventDm;
import com.hivecontrolsolutions.comestag.core.domain.port.EventPort;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/event")
public class GetEventProcessor {

    private final EventPort eventPort;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{eventId}")
    @Operation(summary = "Get event by id")
    public ResponseEntity<EventDm> getEvent(@PathVariable UUID eventId) {
        eventPort.increaseViewCount(eventId);
        var body = eventPort.getById(eventId);
        return ResponseEntity.ok(body);
    }
}
