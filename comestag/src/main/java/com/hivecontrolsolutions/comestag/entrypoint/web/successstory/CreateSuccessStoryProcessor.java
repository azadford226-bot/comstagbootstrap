package com.hivecontrolsolutions.comestag.entrypoint.web.successstory;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateSuccessStoryInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.successstory.CreateSuccessStoryUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.successstory.SuccessStoryRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/success-story")
public class CreateSuccessStoryProcessor {

    private final CreateSuccessStoryUseCase useCase;

    @PreAuthorize("(hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))")
    @PostMapping
    @Operation(summary = "Create success story",
            description = """
                    1. Create a success story for the current organization.
                    2. Upload the media first.
                    """)
    public ResponseEntity<?> createSuccessStory(@CurrentUserId UUID currentUserId,
                                                @Valid @RequestBody SuccessStoryRequest request
    ) {
        useCase.execute(toInput(currentUserId, request));
        return ResponseEntity.ok().build();
    }

    private CreateSuccessStoryInput toInput(UUID orgId, SuccessStoryRequest request) {
        return new CreateSuccessStoryInput(
                orgId,
                request.title(),
                request.body(),
                request.mediaIds(),
                request.hashtags()
        );
    }
}
