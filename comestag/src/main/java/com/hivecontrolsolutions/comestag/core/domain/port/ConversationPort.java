package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import org.springframework.data.domain.Page;

import java.util.Optional;
import java.util.UUID;

public interface ConversationPort {
    ConversationDm create(UUID participant1Id, UUID participant2Id);
    
    Optional<ConversationDm> findByParticipants(UUID userId1, UUID userId2);
    
    Optional<ConversationDm> findById(UUID id);
    
    Page<ConversationDm> findByParticipantId(UUID userId, int page, int size);
    
    Page<ConversationDm> findByParticipantIdWithSearch(UUID userId, String search, int page, int size);
    
    void updateLastMessage(UUID conversationId, UUID messageId);
    
    long countAll();
    
    Page<ConversationDm> findAll(int page, int size);
}
