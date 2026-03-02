package com.hivecontrolsolutions.comestag.entrypoint.web.post;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
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
@RequestMapping("/v1/post")
public class DeletePostProcessor {

    private final PostPort postPort;

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/{postId}")
    @Operation(summary = "delete post")
    public ResponseEntity<?> deletePost(@CurrentUserId UUID currentUserId,
                                        @PathVariable UUID postId) {
        postPort.delete(postId, currentUserId);
        return ResponseEntity.ok().build();
    }
}