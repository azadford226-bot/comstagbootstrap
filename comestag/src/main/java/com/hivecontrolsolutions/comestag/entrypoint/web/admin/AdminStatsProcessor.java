package com.hivecontrolsolutions.comestag.entrypoint.web.admin;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.admin.GetAdminStatsUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.admin.AdminStatsResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/admin")
@RestController
public class AdminStatsProcessor {
    
    private final GetAdminStatsUseCase getAdminStatsUseCase;
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/stats")
    @Operation(summary = "Get admin dashboard statistics",
            description = "Returns statistics for the admin dashboard including user counts, pending organizations, and messages.")
    public ResponseEntity<AdminStatsResponse> getStats() {
        AdminStatsResponse stats = getAdminStatsUseCase.execute();
        return ResponseEntity.ok(stats);
    }
}
