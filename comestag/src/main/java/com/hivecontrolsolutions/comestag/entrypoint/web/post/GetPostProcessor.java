package com.hivecontrolsolutions.comestag.entrypoint.web.post;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.GetPostDetailsInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.post.GetPostDetailsUseCase;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/post")
public class GetPostProcessor {

    private final GetPostDetailsUseCase useCase;

    @Transactional
    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{postId}")
    @Operation(summary = "get post details")
    public ResponseEntity<?> getPost(@CurrentUserId UUID currentUserId,
                                     @PathVariable UUID postId) {

        var input = new GetPostDetailsInput(currentUserId, postId);
        return ResponseEntity.ok(useCase.execute(input));
    }
}