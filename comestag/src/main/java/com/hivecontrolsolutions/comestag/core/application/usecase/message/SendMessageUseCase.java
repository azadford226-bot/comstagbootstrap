package com.hivecontrolsolutions.comestag.core.application.usecase.message;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.SendMessageInput;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.domain.model.MessageDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import com.hivecontrolsolutions.comestag.core.domain.port.MessagePort;
import com.hivecontrolsolutions.comestag.entrypoint.stream.notification.NotificationOutboxPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;


import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class SendMessageUseCase implements Usecase<SendMessageInput, MessageDm> {

    private final ConversationPort conversationPort;
    private final MessagePort messagePort;
    private final NotificationOutboxPublisher notificationPublisher;

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

        // Notify the other participant
        UUID recipientId = conversation.getParticipant1Id().equals(input.senderId())
                ? conversation.getParticipant2Id()
                : conversation.getParticipant1Id();
        if (!recipientId.equals(input.senderId())) {
            notificationPublisher.publishMessageNew(recipientId, input.senderId(), conversation.getId(), message.getId());
        }

        return message;
    }
}
