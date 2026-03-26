package com.hivecontrolsolutions.comestag.entrypoint.web.message;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import com.hivecontrolsolutions.comestag.core.domain.port.MessagePort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.message.ConversationResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/conversations")
public class ConversationContextProcessor {

    private final ConversationPort conversationPort;
    private final AccountPort accountPort;
    private final MessagePort messagePort;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/by-context")
    @Operation(summary = "Find conversation by context",
            description = "Find an existing conversation by context type and context ID (e.g. RFQ thread)")
    public ResponseEntity<ConversationResponse> findByContext(
            @CurrentUserId UUID currentUserId,
            @RequestParam @NotBlank String contextType,
            @RequestParam @NotBlank String contextId) {

        return conversationPort.findByContext(contextType, contextId)
                .map(conv -> ResponseEntity.ok(toResponse(conv, currentUserId)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/with-context")
    @Operation(summary = "Create a conversation with context",
            description = "Create a new conversation linked to a context (e.g. RFQ). Returns existing if one already exists for the same context.")
    public ResponseEntity<ConversationResponse> createWithContext(
            @CurrentUserId UUID currentUserId,
            @RequestBody Map<String, String> body) {

        String recipientIdStr = body.get("recipientId");
        String contextType = body.get("contextType");
        String contextId = body.get("contextId");

        if (recipientIdStr == null || contextType == null || contextId == null) {
            return ResponseEntity.badRequest().build();
        }

        UUID recipientId = UUID.fromString(recipientIdStr);

        // Return existing conversation for this context if one exists
        var existing = conversationPort.findByContext(contextType, contextId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(toResponse(existing.get(), currentUserId));
        }

        ConversationDm conversation = conversationPort.createWithContext(
                currentUserId, recipientId, contextType, contextId);
        return ResponseEntity.status(201).body(toResponse(conversation, currentUserId));
    }

    private ConversationResponse toResponse(ConversationDm conv, UUID currentUserId) {
        UUID otherUserId = conv.getParticipant1Id().equals(currentUserId)
                ? conv.getParticipant2Id()
                : conv.getParticipant1Id();

        var otherAccount = accountPort.getById(otherUserId).orElse(null);
        String otherUserName = otherAccount != null ? otherAccount.getDisplayName() : "Unknown User";
        String otherUserType = otherAccount != null ? otherAccount.getType().name() : "UNKNOWN";

        long unreadCount = messagePort.countUnreadMessages(conv.getId(), currentUserId);

        return new ConversationResponse(
                conv.getId(),
                otherUserId,
                otherUserName,
                otherUserType,
                null,
                conv.getLastMessageTime(),
                null,
                unreadCount,
                conv.getContextType(),
                conv.getContextId(),
                conv.getCreatedAt(),
                conv.getUpdatedAt()
        );
    }
}
