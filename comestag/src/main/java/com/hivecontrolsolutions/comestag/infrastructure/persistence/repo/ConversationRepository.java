package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ConversationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<ConversationEntity, UUID> {

    @Query("""
            SELECT c FROM ConversationEntity c
            WHERE (c.participant1Id = :userId OR c.participant2Id = :userId)
            ORDER BY c.lastMessageTime DESC NULLS LAST, c.updatedAt DESC
            """)
    Page<ConversationEntity> findByParticipantId(@Param("userId") UUID userId, Pageable pageable);

    @Query("""
            SELECT c FROM ConversationEntity c
            WHERE (c.participant1Id = :userId OR c.participant2Id = :userId)
            AND (LOWER(CAST(c.participant1Id AS string)) LIKE LOWER(CONCAT('%', :search, '%'))
                 OR LOWER(CAST(c.participant2Id AS string)) LIKE LOWER(CONCAT('%', :search, '%')))
            ORDER BY c.lastMessageTime DESC NULLS LAST, c.updatedAt DESC
            """)
    Page<ConversationEntity> findByParticipantIdWithSearch(@Param("userId") UUID userId, 
                                                           @Param("search") String search, 
                                                           Pageable pageable);

    @Query("""
            SELECT c FROM ConversationEntity c
            WHERE (c.participant1Id = :userId1 AND c.participant2Id = :userId2)
               OR (c.participant1Id = :userId2 AND c.participant2Id = :userId1)
            """)
    Optional<ConversationEntity> findByParticipants(@Param("userId1") UUID userId1, 
                                                    @Param("userId2") UUID userId2);
    
    @Query("SELECT c FROM ConversationEntity c ORDER BY c.lastMessageTime DESC NULLS LAST, c.updatedAt DESC")
    Page<ConversationEntity> findAll(Pageable pageable);
}
