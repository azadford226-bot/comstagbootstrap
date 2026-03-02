package com.hivecontrolsolutions.comestag.entrypoint.web.successstory;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.port.SuccessStoryPort;
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
@RequestMapping("/v1/success-story")
public class DeleteSuccessStoryProcessor {
    private final SuccessStoryPort successStoryPort;

    @PreAuthorize("hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING'))")
    @DeleteMapping("/{successStoryId}")
    @Operation(summary = "Delete success story")
    public ResponseEntity<?> deleteSuccessStory(@CurrentUserId UUID currentUserId,
                                                @PathVariable UUID successStoryId) {
        successStoryPort.delete(successStoryId, currentUserId);
        return ResponseEntity.ok().build();
    }
}
