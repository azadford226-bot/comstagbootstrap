package com.hivecontrolsolutions.comestag.entrypoint.web.message;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.application.usecase.message.ListConversationsUseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.MessagePort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.message.ConversationResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;
import java.util.stream.Collectors;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/messages/conversations")
public class ListConversationsProcessor {

    private final ListConversationsUseCase useCase;
    private final AccountPort accountPort;
    private final MessagePort messagePort;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping
    @Operation(summary = "List conversations",
            description = "List all conversations for the current user with optional search")
    public ResponseEntity<PageResult<ConversationResponse>> listConversations(
            @CurrentUserId UUID currentUserId,
            @RequestParam(required = false) String search,
            @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
            @Min(1) @Max(100) @RequestParam(defaultValue = "50") int size) {

        var input = new ListConversationsUseCase.Input(currentUserId, search, page, size);
        var result = useCase.execute(input);

        // Map to response with user info and unread counts
        var responses = result.getContent().stream()
                .map(conv -> {
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
                            null, // Last message content would need to be fetched separately
                            conv.getLastMessageTime(),
                            null, // Last message sender would need to be fetched separately
                            unreadCount,
                            conv.getCreatedAt(),
                            conv.getUpdatedAt()
                    );
                })
                .collect(Collectors.toList());

        var pageResult = PageResult.of(responses, page, size, result.getTotalElements());
        return ResponseEntity.ok(pageResult);
    }
}
