package com.hivecontrolsolutions.comestag.entrypoint.web.events;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.port.EventPort;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/event")
public class DeleteEventProcessor {

    private final EventPort eventPort;

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/{eventId}")
    @Operation(summary = "Delete event",
            description = """
                    1. This endpoint allow active organizations to delete event.
                    """
    )
    public ResponseEntity<?> deleteEvent(@CurrentUserId UUID currentUserId,
                                         @PathVariable UUID eventId) {
        eventPort.delete(eventId, currentUserId);
        return ResponseEntity.ok().build();
    }
}