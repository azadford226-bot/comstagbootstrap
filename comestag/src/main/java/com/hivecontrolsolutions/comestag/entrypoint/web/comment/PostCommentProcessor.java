package com.hivecontrolsolutions.comestag.entrypoint.web.comment;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreatePostCommentInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.comment.CreatePostCommentUseCase;
import com.hivecontrolsolutions.comestag.core.application.usecase.comment.DeletePostCommentUseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.PostCommentPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.comment.CreatePostCommentRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/post")
public class PostCommentProcessor {

    private final CreatePostCommentUseCase createUseCase;
    private final DeletePostCommentUseCase deleteUseCase;
    private final PostCommentPort commentPort;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/{postId}/comment")
    public ResponseEntity<?> createComment(@CurrentUserId UUID currentUserId,
                                           @PathVariable UUID postId,
                                           @Valid @RequestBody CreatePostCommentRequest request) {
        createUseCase.execute(new CreatePostCommentInput(
                postId,
                currentUserId,
                request.body(),
                request.parentCommentId()
        ));
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<?> deleteComment(@CurrentUserId UUID currentUserId,
                                           @PathVariable UUID commentId) {
        deleteUseCase.execute(new DeletePostCommentUseCase.Input(commentId, currentUserId));
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{postId}/comments")
    public ResponseEntity<?> listComments(@PathVariable UUID postId,
                                          @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
                                          @Min(1) @Max(100) @RequestParam(defaultValue = "20") int size) {
        var body = commentPort.pageByPost(postId, page, size);
        return ResponseEntity.ok(PageResult.of(body));
    }
}
