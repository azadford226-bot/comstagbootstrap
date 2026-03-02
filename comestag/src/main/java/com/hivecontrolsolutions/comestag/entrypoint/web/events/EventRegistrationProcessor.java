package com.hivecontrolsolutions.comestag.entrypoint.web.events;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.events.RegisterToEventUseCase;
import com.hivecontrolsolutions.comestag.core.application.usecase.events.UnregisterFromEventUseCase;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/event")
public class EventRegistrationProcessor {

    private final RegisterToEventUseCase registerUseCase;
    private final UnregisterFromEventUseCase unregisterUseCase;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/{eventId}/register")
    @Operation(summary = "Register to event")
    public ResponseEntity<?> register(@CurrentUserId UUID currentUserId,
                                      @PathVariable UUID eventId) {
        registerUseCase.execute(new RegisterToEventUseCase.Input(eventId, currentUserId));
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/{eventId}/register")
    @Operation(summary = "Unregister from event")
    public ResponseEntity<?> unregister(@CurrentUserId UUID currentUserId,
                                        @PathVariable UUID eventId) {
        unregisterUseCase.execute(new UnregisterFromEventUseCase.Input(eventId, currentUserId));
        return ResponseEntity.ok().build();
    }
}