package com.hivecontrolsolutions.comestag.entrypoint.web.events;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ListRecommendedEventInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.events.ListRecommendedEventsUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.EventDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.EventPort;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/event")
public class ListEventsProcessor {

    private final AccountPort accountPort;
    private final EventPort eventPort;
    private final ListRecommendedEventsUseCase recommendedUseCase;

    @PreAuthorize("(hasRole('ORG') and hasAuthority('Profile_ACTIVE') )")
    @GetMapping("/my-list")
    @Operation(summary = "list created events by current authenticated org",
            description = """
                    1. list created events by current authenticated organization
                    2. Used in profile organization private profile page.
                    """
    )
    public ResponseEntity<PageResult<EventDm>> listMyEvents(@CurrentUserId UUID currentUserId,
                                                            @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                                            @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        var body = eventPort.pageByOrganization(currentUserId, page, size);
        return ResponseEntity.ok(PageResult.of(body));
    }

//    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
//    @GetMapping("/list")
//    public ResponseEntity<?> listOrgEvents(@RequestParam UUID orgId,
//                                           @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
//                                           @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
//        if (accountPort.isActive(orgId)) {
//            var body = eventPort.pageByOrganization(orgId, page, size);
//            return ResponseEntity.ok(PageResult.of(body));
//        }
//        return ResponseEntity.badRequest().build();
//    }

    // recommended based on current account's location + industry
    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/recommended")
    @Operation(summary = "List recommended events",
            description = """
                    1. List recommended events for current authenticated user.
                    2. Used in events page from home.
                    """
    )
    public ResponseEntity<PageResult<EventDm>> listRecommended(@CurrentUserId UUID currentUserId,
                                                               @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                                               @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        var body = recommendedUseCase.execute(new ListRecommendedEventInput(currentUserId, page, size));
        return ResponseEntity.ok(PageResult.of(body));
    }

    //    // events current account registered to
    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/my-registrations")
    @Operation(summary = "List registered events",
            description = """
                    1. List events that the current authenticated user registered in.
                    2. Used in events page from home.
                    """
    )
    public ResponseEntity<PageResult<EventDm>> listMyRegistrations(@CurrentUserId UUID currentUserId,
                                                 @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                                 @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        var body = eventPort.pageRegisteredEvents(currentUserId, page, size);
        return ResponseEntity.ok(PageResult.of(body));
    }
}
