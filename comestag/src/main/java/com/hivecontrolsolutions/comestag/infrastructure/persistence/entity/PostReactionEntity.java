package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.PostReactionDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.PostReactionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "post_reactions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostReactionEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "post_id", nullable = false)
    private UUID postId;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Enumerated(EnumType.STRING)
    @Column(name = "reaction", nullable = false)
    private PostReactionType reaction;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    public PostReactionDm toDm() {
        return PostReactionDm.builder()
                .id(id)
                .postId(postId)
                .accountId(accountId)
                .reaction(reaction)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
    }
}