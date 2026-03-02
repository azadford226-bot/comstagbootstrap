package com.hivecontrolsolutions.comestag.entrypoint.web.successstory;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateSuccessStoryInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.successstory.EditSuccessStoryUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.successstory.UpdateSuccessStoryRequest;
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
@RequestMapping("/v1/success-story")
public class UpdateSuccessStoryProcessor {

    private final EditSuccessStoryUseCase useCase;

    @PreAuthorize("hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING'))")
    @PutMapping("/{successStoryId}")
    @Operation(summary = "Edit success story",
            description = """
                    1. Edit the success story of the current organization.
                    2. If there are media to delete or to add upload them first.
                    """)
    public ResponseEntity<?> editSuccessStory(@CurrentUserId UUID currentUserId,
                                              @PathVariable UUID successStoryId,
                                              @Valid @RequestBody UpdateSuccessStoryRequest request) {
        useCase.execute(toUpdateSuccessStoryInput(currentUserId, successStoryId, request));
        return ResponseEntity.ok().build();
    }

    private UpdateSuccessStoryInput toUpdateSuccessStoryInput(UUID currentUserId, UUID successStoryId, UpdateSuccessStoryRequest request) {
        return new UpdateSuccessStoryInput(
                currentUserId,
                successStoryId,
                request.title(),
                request.body(),
                request.deletedMediaIds(),
                request.newMediaIds(),
                request.deletedHashtagIds(),
                request.newHashtagIds()
        );
    }
}
