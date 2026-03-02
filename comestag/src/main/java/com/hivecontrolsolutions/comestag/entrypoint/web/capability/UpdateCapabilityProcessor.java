package com.hivecontrolsolutions.comestag.entrypoint.web.capability;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateCapabilityInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.capability.EditCapabilityUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.capability.UpdateCapabilityRequest;
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
@RequestMapping("/v1/capability")
public class UpdateCapabilityProcessor {

    private final EditCapabilityUseCase useCase;

    @PreAuthorize("hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING'))")
    @PutMapping("/{capabilityId}")
    @Operation(summary = "Create capability", description = "Use this endpoint to allow organizations to update there capabilities")
    public ResponseEntity<?> editCapability(@CurrentUserId UUID currentUserId,
                                            @PathVariable UUID capabilityId,
                                            @Valid @RequestBody UpdateCapabilityRequest request) {
        useCase.execute(toInput(currentUserId, capabilityId, request));
        return ResponseEntity.ok().build();
    }

    private UpdateCapabilityInput toInput(UUID orgId,
                                          UUID capabilityId,
                                          UpdateCapabilityRequest request) {
        return new UpdateCapabilityInput(
                orgId,
                capabilityId,
                request.name(),
                request.body(),
                request.deletedHashtagIds(),
                request.newHashtagIds()
        );
    }
}