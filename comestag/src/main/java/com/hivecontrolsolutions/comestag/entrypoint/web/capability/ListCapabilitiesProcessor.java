package com.hivecontrolsolutions.comestag.entrypoint.web.capability;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.domain.model.CapabilityDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.CapabilityPort;
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
@RequestMapping("/v1/capability")
public class ListCapabilitiesProcessor {

    private final AccountPort accountPort;
    private final CapabilityPort capabilityPort;

    @PreAuthorize("(hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))")
    @GetMapping("/my-list")
    @Operation(summary = "List my capabilities", description = "Use this endpoint allow the organizations to list it's capabilities even if the organization is pending")
    public ResponseEntity<PageResult<CapabilityDm>> listMyCapabilities(@CurrentUserId UUID currentUserId,
                                                                       @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                                                       @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        var responseBody = capabilityPort.pageByOrganization(currentUserId, page, size);
        return ResponseEntity.ok(PageResult.of(responseBody));
    }

    @PreAuthorize("hasAnyRole('CONSUMER', 'ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/list")
    @Operation(summary = "List capabilities of other organizations",
            description = """
                    Use this endpoint allow consumer or organization to list other organizations (active) capabilities.
                    It's a paginated endpoint.
                    """)
    public ResponseEntity<PageResult<CapabilityDm>> listCapabilities(@RequestParam UUID orgId,
                                                                     @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                                                     @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        if (accountPort.isActive(orgId)) {
            var responseBody = capabilityPort.pageByOrganization(orgId, page, size);
            return ResponseEntity.ok(PageResult.of(responseBody));
        }
        return ResponseEntity.badRequest().build();
    }
}