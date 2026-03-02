package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.MessageDm;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface MessagePort {
    MessageDm create(UUID conversationId, UUID senderId, String content);
    
    Page<MessageDm> findByConversationId(UUID conversationId, int page, int size);
    
    int markConversationAsRead(UUID conversationId, UUID userId);
    
    long countUnreadMessages(UUID conversationId, UUID userId);
}
