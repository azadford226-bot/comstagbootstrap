package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "conversations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"participant1_id", "participant2_id"})
})
public class ConversationEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "participant1_id", nullable = false)
    private UUID participant1Id;

    @Column(name = "participant2_id", nullable = false)
    private UUID participant2Id;

    @Column(name = "last_message_id")
    private UUID lastMessageId;

    @Column(name = "last_message_time")
    private Instant lastMessageTime;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    public ConversationDm toDm() {
        return ConversationDm.builder()
                .id(id)
                .participant1Id(participant1Id)
                .participant2Id(participant2Id)
                .lastMessageId(lastMessageId)
                .lastMessageTime(lastMessageTime)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
    }
}
