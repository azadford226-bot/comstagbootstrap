package com.hivecontrolsolutions.comestag.entrypoint.web.reaction;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ReactToPostInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.reaction.ReactToPostUseCase;
import com.hivecontrolsolutions.comestag.core.application.usecase.reaction.RemoveReactionUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.reaction.ReactToPostRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

//@Processor
//@RequiredArgsConstructor
//@RequestMapping("/v1/post")
public class PostReactionProcessor {

//    private final ReactToPostUseCase reactUseCase;
//    private final RemoveReactionUseCase removeUseCase;
//
//    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
//    @PostMapping("/{postId}/react")
//    public ResponseEntity<?> react(@CurrentUserId UUID currentUserId,
//                                   @PathVariable UUID postId,
//                                   @Valid @RequestBody ReactToPostRequest request) {
//        reactUseCase.execute(ReactToPostInput.builder()
//                .postId(postId)
//                .accountId(currentUserId)
//                .reaction(request.reaction())
//                .build());
//        return ResponseEntity.ok().build();
//    }
//
//    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
//    @DeleteMapping("/{postId}/react")
//    public ResponseEntity<?> removeReaction(@CurrentUserId UUID currentUserId,
//                                            @PathVariable UUID postId) {
//        removeUseCase.execute(new RemoveReactionUseCase.Input(postId, currentUserId));
//        return ResponseEntity.ok().build();
//    }
}
