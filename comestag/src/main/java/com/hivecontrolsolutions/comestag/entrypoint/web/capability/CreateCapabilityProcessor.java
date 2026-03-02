package com.hivecontrolsolutions.comestag.entrypoint.web.capability;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateCapabilityInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.capability.CreateCapabilityUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.capability.CapabilityRequest;
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
@RequestMapping("/v1/capability")
public class CreateCapabilityProcessor {

    private final CreateCapabilityUseCase useCase;

    @PreAuthorize("(hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))")
    @PostMapping
    @Operation(summary = "Create capability", description = "Use this endpoint to allow organizations to create there capabilities")
    public ResponseEntity<?> createCapability(@CurrentUserId UUID currentUserId,
                                              @Valid @RequestBody CapabilityRequest request) {
        useCase.execute(toInput(currentUserId, request));
        return ResponseEntity.ok().build();
    }

    private CreateCapabilityInput toInput(UUID orgId, CapabilityRequest request) {
        return new CreateCapabilityInput(
                orgId,
                request.title(),
                request.body(),
                request.hashtags()
        );
    }
}