package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ConversationEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class ConversationAdapter implements ConversationPort {

    private final ConversationRepository repo;

    @Override
    @Transactional
    public ConversationDm create(UUID participant1Id, UUID participant2Id) {
        // Ensure consistent ordering (smaller UUID first)
        UUID p1 = participant1Id.compareTo(participant2Id) < 0 ? participant1Id : participant2Id;
        UUID p2 = participant1Id.compareTo(participant2Id) < 0 ? participant2Id : participant1Id;
        
        var entity = ConversationEntity.builder()
                .participant1Id(p1)
                .participant2Id(p2)
                .build();
        return repo.save(entity).toDm();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ConversationDm> findByParticipants(UUID userId1, UUID userId2) {
        return repo.findByParticipants(userId1, userId2)
                .map(ConversationEntity::toDm);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ConversationDm> findById(UUID id) {
        return repo.findById(id)
                .map(ConversationEntity::toDm);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationDm> findByParticipantId(UUID userId, int page, int size) {
        return repo.findByParticipantId(userId, PageRequest.of(page, size))
                .map(ConversationEntity::toDm);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationDm> findByParticipantIdWithSearch(UUID userId, String search, int page, int size) {
        return repo.findByParticipantIdWithSearch(userId, search, PageRequest.of(page, size))
                .map(ConversationEntity::toDm);
    }

    @Override
    @Transactional
    public void updateLastMessage(UUID conversationId, UUID messageId) {
        repo.findById(conversationId).ifPresent(conv -> {
            // This is handled by the database trigger, but we can update if needed
            conv.setLastMessageId(messageId);
            repo.save(conv);
        });
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countAll() {
        return repo.count();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<ConversationDm> findAll(int page, int size) {
        return repo.findAll(PageRequest.of(page, size))
                .map(ConversationEntity::toDm);
    }
}
