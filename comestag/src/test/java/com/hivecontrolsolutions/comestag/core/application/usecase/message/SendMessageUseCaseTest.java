package com.hivecontrolsolutions.comestag.core.application.usecase.message;

import com.hivecontrolsolutions.comestag.core.application.entity.input.SendMessageInput;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.domain.model.MessageDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import com.hivecontrolsolutions.comestag.core.domain.port.MessagePort;
import com.hivecontrolsolutions.comestag.entrypoint.stream.notification.NotificationOutboxPublisher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link SendMessageUseCase} focusing on delivery + the new-message
 * notification being published to the OTHER participant (and never to the sender).
 */
@ExtendWith(MockitoExtension.class)
class SendMessageUseCaseTest {

    @Mock private ConversationPort conversationPort;
    @Mock private MessagePort messagePort;
    @Mock private NotificationOutboxPublisher notificationPublisher;

    @InjectMocks
    private SendMessageUseCase useCase;

    @Test
    void existingConversation_senderIsParticipant1_notifiesParticipant2() {
        UUID convId = UUID.randomUUID();
        UUID sender = UUID.randomUUID();
        UUID other = UUID.randomUUID();
        UUID msgId = UUID.randomUUID();

        ConversationDm conversation = ConversationDm.builder()
                .id(convId).participant1Id(sender).participant2Id(other).build();
        MessageDm message = MessageDm.builder().id(msgId).build();

        when(conversationPort.findById(convId)).thenReturn(Optional.of(conversation));
        when(messagePort.create(convId, sender, "Hello")).thenReturn(message);

        SendMessageInput input = SendMessageInput.builder()
                .conversationId(convId).senderId(sender).content("Hello").build();

        MessageDm result = useCase.execute(input);

        assertEquals(message, result);
        verify(conversationPort).updateLastMessage(convId, msgId);
        verify(notificationPublisher).publishMessageNew(other, sender, convId, msgId);
    }

    @Test
    void existingConversation_senderIsParticipant2_notifiesParticipant1() {
        UUID convId = UUID.randomUUID();
        UUID sender = UUID.randomUUID();
        UUID other = UUID.randomUUID();
        UUID msgId = UUID.randomUUID();

        ConversationDm conversation = ConversationDm.builder()
                .id(convId).participant1Id(other).participant2Id(sender).build();
        MessageDm message = MessageDm.builder().id(msgId).build();

        when(conversationPort.findById(convId)).thenReturn(Optional.of(conversation));
        when(messagePort.create(convId, sender, "Hi")).thenReturn(message);

        SendMessageInput input = SendMessageInput.builder()
                .conversationId(convId).senderId(sender).content("Hi").build();

        useCase.execute(input);

        verify(notificationPublisher).publishMessageNew(other, sender, convId, msgId);
    }
}
