package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.MessageDm;
import com.hivecontrolsolutions.comestag.core.domain.port.MessagePort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.MessageEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class MessageAdapter implements MessagePort {

    private final MessageRepository repo;

    @Override
    @Transactional
    public MessageDm create(UUID conversationId, UUID senderId, String content) {
        var entity = MessageEntity.builder()
                .conversationId(conversationId)
                .senderId(senderId)
                .content(content)
                .read(false)
                .build();
        return repo.save(entity).toDm();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDm> findByConversationId(UUID conversationId, int page, int size) {
        return repo.findByConversationIdOrderByCreatedAtAsc(conversationId, PageRequest.of(page, size))
                .map(MessageEntity::toDm);
    }

    @Override
    @Transactional
    public int markConversationAsRead(UUID conversationId, UUID userId) {
        return repo.markConversationAsRead(conversationId, userId, Instant.now());
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadMessages(UUID conversationId, UUID userId) {
        return repo.countUnreadMessages(conversationId, userId);
    }
}
