package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.PostDm;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "posts")
public class PostEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "org_id", nullable = false)
    private UUID orgId;

    @Column(name = "body", nullable = false, columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String body;

    @Column(name = "reactions_count", nullable = false)
    private long reactionsCount;

    @Column(name = "comments_count", nullable = false)
    private long commentsCount;

    @Column(name = "views", nullable = false)
    private long views;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    private List<PostMediaEntity> media;

    public PostDm toDm() {
        var safeMedia = media == null ? List.<PostMediaEntity>of() : media;

        return PostDm.builder()
                .id(id)
                .orgId(orgId)
                .body(body)
                .reactionsCount(reactionsCount)
                .commentsCount(commentsCount)
                .views(views)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .media(
                        safeMedia.stream()
                                .map(m -> m.getMedia().toDm())
                                .toList()
                )
                .build();
    }
}
