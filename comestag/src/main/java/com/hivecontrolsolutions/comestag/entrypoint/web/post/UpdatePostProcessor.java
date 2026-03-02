package com.hivecontrolsolutions.comestag.entrypoint.web.post;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdatePostInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.post.EditPostUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.post.UpdatePostRequest;
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
@RequestMapping("/v1/post")
public class UpdatePostProcessor {

    private final EditPostUseCase useCase;

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @PutMapping("/{postId}")
    @Operation(summary = "Update post",
            description = """
                    1. update post wth specific post id.
                    2. Only active organization have access to this endpoint.
                    3. upload media first if needed.
                    """
    )
    public ResponseEntity<?> editPost(@CurrentUserId UUID currentUserId,
                                      @PathVariable UUID postId,
                                      @Valid @RequestBody UpdatePostRequest request) {
        useCase.execute(UpdatePostInput.builder()
                .orgId(currentUserId)
                .postId(postId)
                .body(request.body())
                .deletedMediaIds(request.deletedMediaIds())
                .newMediaIds(request.newMediaIds())
                .build());
        return ResponseEntity.ok().build();
    }
}
