package com.hivecontrolsolutions.comestag.entrypoint.web.comment;

//@Processor
//@RequiredArgsConstructor
//@RequestMapping("/v1/post")
public class PostCommentProcessor {

//    private final CreatePostCommentUseCase createUseCase;
//    private final DeletePostCommentUseCase deleteUseCase;
//    private final PostCommentPort commentPort;
//
//    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
//    @PostMapping("/{postId}/comment")
//    public ResponseEntity<?> createComment(@CurrentUserId UUID currentUserId,
//                                           @PathVariable UUID postId,
//                                           @Valid @RequestBody CreatePostCommentRequest request) {
//        createUseCase.execute(new CreatePostCommentInput(
//                postId,
//                currentUserId,
//                request.body(),
//                request.parentCommentId()
//        ));
//        return ResponseEntity.ok().build();
//    }
//
//    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
//    @DeleteMapping("/comment/{commentId}")
//    public ResponseEntity<?> deleteComment(@CurrentUserId UUID currentUserId,
//                                           @PathVariable UUID commentId) {
//        deleteUseCase.execute(new DeletePostCommentUseCase.Input(commentId, currentUserId));
//        return ResponseEntity.ok().build();
//    }
//
//    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
//    @GetMapping("/{postId}/comments")
//    public ResponseEntity<?> listComments(@PathVariable UUID postId,
//                                          @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
//                                          @Min(1) @Max(100) @RequestParam(defaultValue = "20") int size) {
//        var body = commentPort.pageByPost(postId, page, size);
//        return ResponseEntity.ok(PageResult.of(body));
//    }
}
