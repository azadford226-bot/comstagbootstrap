package com.hivecontrolsolutions.comestag.entrypoint.web.admin;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.admin.ApproveOrganizationUseCase;
import com.hivecontrolsolutions.comestag.core.application.usecase.admin.ListOrganizationsUseCase;
import com.hivecontrolsolutions.comestag.core.application.usecase.admin.ListPendingOrganizationsUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/admin/organizations")
@RestController
public class AdminOrganizationProcessor {
    
    private final ListOrganizationsUseCase listOrganizationsUseCase;
    private final ListPendingOrganizationsUseCase listPendingOrganizationsUseCase;
    private final ApproveOrganizationUseCase approveOrganizationUseCase;
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    @Operation(summary = "List all organizations",
            description = "Returns a paginated list of all organizations.")
    public ResponseEntity<PageResult<OrganizationDm>> listOrganizations(
            @RequestParam(defaultValue = "0") int page) {
        Page<OrganizationDm> result = listOrganizationsUseCase.execute(page);
        return ResponseEntity.ok(PageResult.of(result));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    @Operation(summary = "List pending organizations",
            description = "Returns a paginated list of organizations awaiting approval.")
    public ResponseEntity<PageResult<OrganizationDm>> listPendingOrganizations(
            @RequestParam(defaultValue = "0") int page) {
        Page<OrganizationDm> result = listPendingOrganizationsUseCase.execute(page);
        return ResponseEntity.ok(PageResult.of(result));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{orgId}/approve")
    @Operation(summary = "Approve an organization",
            description = "Approves a pending organization, allowing them to use the platform.")
    public ResponseEntity<Void> approveOrganization(@PathVariable UUID orgId) {
        approveOrganizationUseCase.execute(orgId);
        return ResponseEntity.ok().build();
    }
}
