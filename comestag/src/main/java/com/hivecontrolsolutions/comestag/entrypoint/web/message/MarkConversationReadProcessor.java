package com.hivecontrolsolutions.comestag.entrypoint.web.message;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.message.MarkConversationReadUseCase;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/messages/conversations")
public class MarkConversationReadProcessor {

    private final MarkConversationReadUseCase useCase;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PutMapping("/{conversationId}/read")
    @Operation(summary = "Mark conversation as read",
            description = "Mark all messages in a conversation as read")
    public ResponseEntity<?> markAsRead(
            @CurrentUserId UUID currentUserId,
            @PathVariable UUID conversationId) {

        var input = new MarkConversationReadUseCase.Input(conversationId, currentUserId);
        useCase.execute(input);
        return ResponseEntity.ok().build();
    }
}
