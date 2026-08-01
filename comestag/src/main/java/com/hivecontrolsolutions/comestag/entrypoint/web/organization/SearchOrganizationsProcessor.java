package com.hivecontrolsolutions.comestag.entrypoint.web.organization;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.application.usecase.organization.SearchOrganizationsUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

/**
 * Public (authenticated) company directory used by the messaging "new message" picker.
 */
@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/organizations")
public class SearchOrganizationsProcessor {

    private final SearchOrganizationsUseCase searchOrganizationsUseCase;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping
    @Operation(summary = "Search approved organizations",
            description = "Returns a paginated list of approved organizations (excluding the current account), " +
                    "optionally filtered by display name. Used by the company directory / new-message picker.")
    public ResponseEntity<PageResult<OrganizationDm>> search(
            @CurrentUserId UUID currentUserId,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page) {
        Page<OrganizationDm> result = searchOrganizationsUseCase.execute(
                new SearchOrganizationsUseCase.Input(currentUserId, q, page));
        return ResponseEntity.ok(PageResult.of(result));
    }
}
