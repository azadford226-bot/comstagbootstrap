package com.hivecontrolsolutions.comestag.core.application.usecase.message;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.SendMessageInput;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.domain.model.MessageDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import com.hivecontrolsolutions.comestag.core.domain.port.MessagePort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;


@UseCase
@RequiredArgsConstructor
public class SendMessageUseCase implements Usecase<SendMessageInput, MessageDm> {

    private final ConversationPort conversationPort;
    private final MessagePort messagePort;

    @Override
    @Transactional
    public MessageDm execute(SendMessageInput input) {
        ConversationDm conversation;
        
        // Get or create conversation
        if (input.conversationId() != null) {
            conversation = conversationPort.findById(input.conversationId())
                    .orElseThrow(() -> new RuntimeException("Conversation not found"));
        } else {
            // Find existing conversation or create new one
            conversation = conversationPort.findByParticipants(input.senderId(), input.recipientId())
                    .orElseGet(() -> conversationPort.create(input.senderId(), input.recipientId()));
        }
        
        // Create message
        MessageDm message = messagePort.create(conversation.getId(), input.senderId(), input.content());
        
        // Update conversation's last message (handled by trigger, but we can update here too)
        conversationPort.updateLastMessage(conversation.getId(), message.getId());
        
        return message;
    }
}
