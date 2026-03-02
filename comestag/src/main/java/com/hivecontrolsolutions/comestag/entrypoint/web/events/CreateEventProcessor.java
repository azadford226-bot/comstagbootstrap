package com.hivecontrolsolutions.comestag.entrypoint.web.events;


import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateEventInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.events.CreateEventUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.event.EventRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/event")
public class CreateEventProcessor {

    private final CreateEventUseCase useCase;

    @PreAuthorize("(hasRole('ORG') and hasAuthority('Profile_ACTIVE') )")
    @PostMapping
    @Operation(summary = "Create event",
            description = """
                    1. This endpoint allow active organizations to create event.
                    """
    )
    public ResponseEntity<?> createEvent(@CurrentUserId UUID currentUserId,
                                         @Valid @RequestBody EventRequest request) {
        useCase.execute(toInput(currentUserId, request));
        return ResponseEntity.ok().build();
    }

    private CreateEventInput toInput(UUID orgId, EventRequest r) {
        return CreateEventInput.builder()
                .orgId(orgId)
                .title(r.title())
                .body(r.body())
                .industry(r.industry())
                .country(r.country())
                .state(r.state())
                .city(r.city())
                .address(r.address())
                .startAt(r.startAt())
                .endAt(r.endAt())
                .online(r.online())
                .onlineLink(r.onlineLink())
                .mediaIds(r.mediaIds())
                .build();
    }
}
