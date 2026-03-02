package com.hivecontrolsolutions.comestag.entrypoint.web.message;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.application.usecase.message.ListMessagesUseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.message.MessageResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;
import java.util.stream.Collectors;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/messages/conversations")
public class ListMessagesProcessor {

    private final ListMessagesUseCase useCase;
    private final AccountPort accountPort;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{conversationId}/messages")
    @Operation(summary = "List messages in a conversation",
            description = "Get all messages for a specific conversation")
    public ResponseEntity<PageResult<MessageResponse>> listMessages(
            @CurrentUserId UUID currentUserId,
            @PathVariable UUID conversationId,
            @Min(0) @Max(100) @RequestParam(defaultValue = "0") int page,
            @Min(1) @Max(100) @RequestParam(defaultValue = "100") int size) {

        var input = new ListMessagesUseCase.Input(conversationId, page, size);
        var result = useCase.execute(input);

        // Map to response with sender names
        var responses = result.getContent().stream()
                .map(msg -> {
                    var senderAccount = accountPort.getById(msg.getSenderId()).orElse(null);
                    String senderName = senderAccount != null ? senderAccount.getDisplayName() : "Unknown User";
                    
                    return new MessageResponse(
                            msg.getId(),
                            msg.getConversationId(),
                            msg.getSenderId(),
                            senderName,
                            msg.getContent(),
                            msg.getCreatedAt(),
                            msg.isRead(),
                            msg.getReadAt()
                    );
                })
                .collect(Collectors.toList());

        var pageResult = PageResult.of(responses, page, size, result.getTotalElements());
        return ResponseEntity.ok(pageResult);
    }
}
