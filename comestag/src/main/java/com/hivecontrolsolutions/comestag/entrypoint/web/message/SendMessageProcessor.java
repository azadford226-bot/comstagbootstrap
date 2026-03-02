package com.hivecontrolsolutions.comestag.entrypoint.web.message;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.SendMessageInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.message.SendMessageUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.domain.model.MessageDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.message.MessageResponse;
import com.hivecontrolsolutions.comestag.entrypoint.entity.message.SendMessageRequest;
import com.hivecontrolsolutions.comestag.entrypoint.stream.message.MessageSseRegistry;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/messages")
public class SendMessageProcessor {

    private final SendMessageUseCase useCase;
    private final AccountPort accountPort;
    private final ConversationPort conversationPort;
    private final MessageSseRegistry messageSseRegistry;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")

    @PostMapping("/send")
    @Operation(summary = "Send a message",
            description = "Send a message. Creates a new conversation if conversationId is not provided.")
    public ResponseEntity<MessageResponse> sendMessage(
            @CurrentUserId UUID currentUserId,
            @Valid @RequestBody SendMessageRequest request) {

        var input = SendMessageInput.builder()
                .conversationId(request.conversationId())
                .senderId(currentUserId)
                .recipientId(request.recipientId())
                .content(request.content())
                .build();

        MessageDm message = useCase.execute(input);
        
        // Get sender name for response
        var senderAccount = accountPort.getById(message.getSenderId()).orElse(null);
        String senderName = senderAccount != null ? senderAccount.getDisplayName() : "Unknown User";
        
        var response = new MessageResponse(
                message.getId(),
                message.getConversationId(),
                message.getSenderId(),
                senderName,
                message.getContent(),
                message.getCreatedAt(),
                message.isRead(),
                message.getReadAt()
        );

        // Emit real-time event to recipient
        try {
            ConversationDm conversation = conversationPort.findById(message.getConversationId()).orElse(null);
            if (conversation != null) {
                UUID recipientId = conversation.getParticipant1Id().equals(input.senderId()) 
                    ? conversation.getParticipant2Id() 
                    : conversation.getParticipant1Id();
                
                // Create message data map
                Map<String, Object> messageData = new HashMap<>();
                messageData.put("id", message.getId().toString());
                messageData.put("conversationId", message.getConversationId().toString());
                messageData.put("senderId", message.getSenderId().toString());
                messageData.put("senderName", senderName);
                messageData.put("content", message.getContent());
                messageData.put("timestamp", message.getCreatedAt().toString());
                messageData.put("read", message.isRead());
                if (message.getReadAt() != null) {
                    messageData.put("readAt", message.getReadAt().toString());
                }
                
                // Create event data wrapper
                Map<String, Object> eventData = new HashMap<>();
                eventData.put("message", messageData);
                eventData.put("conversationId", message.getConversationId().toString());
                
                // Emit to recipient
                messageSseRegistry.emit(recipientId, "new_message", eventData);
                
                // Also emit to sender (for confirmation and UI updates)
                messageSseRegistry.emit(input.senderId(), "message_sent", eventData);
            }
        } catch (Exception e) {
            // Log error but don't fail the request
            // SSE emission failure shouldn't prevent message from being saved
        }

        return ResponseEntity.status(CREATED).body(response);
    }
}
