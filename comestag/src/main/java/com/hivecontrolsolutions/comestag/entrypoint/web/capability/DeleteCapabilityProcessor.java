package com.hivecontrolsolutions.comestag.entrypoint.web.capability;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.port.CapabilityPort;
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
@RequestMapping("/v1/capability")
public class DeleteCapabilityProcessor {

    private final CapabilityPort capabilityPort;

    @PreAuthorize("hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING'))")
    @DeleteMapping("/{capabilityId}")
    @Operation(summary = "Delete capability", description = "Use this endpoint to delete capability")
    public ResponseEntity<?> deleteCapability(@CurrentUserId UUID currentUserId,
                                              @PathVariable UUID capabilityId) {
        capabilityPort.delete(capabilityId, currentUserId);
        return ResponseEntity.ok().build();
    }
}