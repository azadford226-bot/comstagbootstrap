package com.hivecontrolsolutions.comestag.entrypoint.web.events;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateEventInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.events.EditEventUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.event.UpdateEventRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/event")
public class UpdateEventProcessor {

    private final EditEventUseCase useCase;

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @PutMapping("/{eventId}")
    @Operation(summary = "Update event",
            description = """
                    1. Update specific event by id.
                    2. Only organization have access to this endpoint.
                    3. Upload media first if needed
                    """
    )
    public ResponseEntity<?> editEvent(@CurrentUserId UUID currentUserId,
                                       @PathVariable UUID eventId,
                                       @Valid @RequestBody UpdateEventRequest request) {
        useCase.execute(toInput(currentUserId, eventId, request));
        return ResponseEntity.ok().build();
    }

    private UpdateEventInput toInput(UUID orgId, UUID eventId, UpdateEventRequest r) {
        return UpdateEventInput.builder()
                .orgId(orgId)
                .eventId(eventId)
                .title(r.title())
                .body(r.body())
                .industry(r.industryId())
                .country(r.country())
                .state(r.state())
                .city(r.city())
                .address(r.address())
                .startAt(r.startAt())
                .endAt(r.endAt())
                .online(r.online())
                .onlineLink(r.onlineLink())
                .deletedMediaIds(r.deletedMediaIds())
                .newMediaIds(r.newMediaIds())
                .build();
    }
}
