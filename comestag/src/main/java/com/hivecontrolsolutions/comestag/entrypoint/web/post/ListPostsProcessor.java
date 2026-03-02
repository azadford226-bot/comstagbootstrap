package com.hivecontrolsolutions.comestag.entrypoint.web.post;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
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
@RequestMapping("/v1/post")
public class ListPostsProcessor {

    private final PostPort postPort;

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/my-list")
    @Operation(summary = "list my posts",
            description = """
                    1. List my posts using access token only
                    2. Only active organization have access to this endpoint
                    """
    )
    public ResponseEntity<?> listMyPosts(@CurrentUserId UUID currentUserId,
                                         @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                         @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        var body = postPort.pageByOrganization(currentUserId, page, size);
        return ResponseEntity.ok(PageResult.of(body));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/list")
    @Operation(summary = "list posts",
            description = """
                    List posts of specific org and used when you view organization profile.
                    """
    )
    public ResponseEntity<?> listOrgPosts(@RequestParam UUID orgId,
                                          @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                          @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        var body = postPort.pageByOrganization(orgId, page, size);
        return ResponseEntity.ok(PageResult.of(body));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/latest")
    @Operation(summary = "list latest posts",
            description = """
                    List latest posts and used in home page
                    """
    )
    public ResponseEntity<?> listLatest(@Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                        @Min(1) @Max(100) @RequestParam(defaultValue = "10") int size) {
        var body = postPort.pageLatest(page, size);
        return ResponseEntity.ok(PageResult.of(body));
    }
}
