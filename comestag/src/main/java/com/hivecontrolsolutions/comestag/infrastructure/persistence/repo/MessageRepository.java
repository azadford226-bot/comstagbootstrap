package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.MessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<MessageEntity, UUID> {

    Page<MessageEntity> findByConversationIdOrderByCreatedAtAsc(UUID conversationId, Pageable pageable);

    @Modifying
    @Query("""
            UPDATE MessageEntity m
            SET m.read = true, m.readAt = :readAt
            WHERE m.conversationId = :conversationId
              AND m.senderId != :userId
              AND m.read = false
            """)
    int markConversationAsRead(@Param("conversationId") UUID conversationId,
                              @Param("userId") UUID userId,
                              @Param("readAt") Instant readAt);

    @Query("""
            SELECT COUNT(m) FROM MessageEntity m
            WHERE m.conversationId = :conversationId
              AND m.senderId != :userId
              AND m.read = false
            """)
    long countUnreadMessages(@Param("conversationId") UUID conversationId,
                             @Param("userId") UUID userId);
}
