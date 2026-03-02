package com.hivecontrolsolutions.comestag.entrypoint.web.post;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreatePostInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.post.CreatePostUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.post.PostRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/post")
public class CreatePostProcessor {

    private final CreatePostUseCase useCase;

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping
    @Operation(summary = "Create post",
            description = """
                    1. Create a post for the current organization.
                    2. Upload the media first.
                    """)
    public ResponseEntity<?> createPost(@CurrentUserId UUID currentUserId,
                                        @Valid @RequestBody PostRequest request) {
        useCase.execute(CreatePostInput.builder()
                .orgId(currentUserId)
                .body(request.body())
                .mediaIds(request.mediaIds())
                .build());
        return ResponseEntity.status(CREATED).build();
    }
}
