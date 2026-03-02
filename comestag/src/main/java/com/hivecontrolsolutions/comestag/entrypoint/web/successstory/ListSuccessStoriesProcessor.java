package com.hivecontrolsolutions.comestag.entrypoint.web.successstory;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.domain.model.SuccessStoryDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.SuccessStoryPort;
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
@RequestMapping("/v1/success-story")
public class ListSuccessStoriesProcessor {

    private final AccountPort accountPort;
    private final SuccessStoryPort successStoryPort;

    @PreAuthorize("(hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))")
    @GetMapping("/my-list")
    @Operation(summary = "List my success stories",
            description = """
                    1. List success stories of the current organization.
                    2. Return a page of success stories.
                    """
    )
    public ResponseEntity<PageResult<SuccessStoryDm>> listMySuccessStories(@CurrentUserId UUID currentUserId,
                                                                           @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                                                           @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        var responseBody = successStoryPort.pageByOrganization(currentUserId, page, size);
        return ResponseEntity.ok(PageResult.of(responseBody));
    }

    @PreAuthorize("hasAnyRole('CONSUMER', 'ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/list")
    @Operation(summary = "List success stories",
            description = """
                    1. List success stories of specific organization.
                    2. Return a page of success stories.
                    """)
    public ResponseEntity<PageResult<SuccessStoryDm>> listSuccessStories(@RequestParam UUID orgId,
                                                @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                                @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        if (accountPort.isActive(orgId)) {
            var responseBody = successStoryPort.pageByOrganization(orgId, page, size);
            return ResponseEntity.ok(PageResult.of(responseBody));
        }
        return ResponseEntity.badRequest().build();

    }
}
