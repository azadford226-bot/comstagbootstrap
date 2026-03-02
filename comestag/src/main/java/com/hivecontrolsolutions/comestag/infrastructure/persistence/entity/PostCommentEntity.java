package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.PostCommentDm;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "post_comments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostCommentEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "post_id", nullable = false)
    private UUID postId;

    @Column(name = "account_id", nullable = false)
    private UUID accountId;

    @Column(name = "body", nullable = false)
    private String body;

    @Column(name = "parent_comment_id")
    private UUID parentCommentId;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    public PostCommentDm toDm() {
        return PostCommentDm.builder()
                .id(id)
                .postId(postId)
                .accountId(accountId)
                .body(body)
                .parentCommentId(parentCommentId)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .build();
    }
}