package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.MessageDm;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "messages")
public class MessageEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "conversation_id", nullable = false)
    private UUID conversationId;

    @Column(name = "sender_id", nullable = false)
    private UUID senderId;

    @Column(name = "content", nullable = false, columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String content;

    @Column(name = "read", nullable = false)
    private boolean read;

    @Column(name = "read_at")
    private Instant readAt;

    @Column(name = "pinned", nullable = false)
    @Builder.Default
    private boolean pinned = false;

    @Column(name = "pinned_at")
    private Instant pinnedAt;

    @Column(name = "pinned_by")
    private UUID pinnedBy;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    public MessageDm toDm() {
        return MessageDm.builder()
                .id(id)
                .conversationId(conversationId)
                .senderId(senderId)
                .content(content)
                .read(read)
                .readAt(readAt)
                .pinned(pinned)
                .pinnedAt(pinnedAt)
                .pinnedBy(pinnedBy)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
    }
}
