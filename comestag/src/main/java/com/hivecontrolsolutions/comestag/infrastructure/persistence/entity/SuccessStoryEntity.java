package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.SuccessStoryDm;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.util.Pair;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "success_stories")
public class SuccessStoryEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "org_id", nullable = false)
    private UUID orgId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "body", nullable = false, columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String body;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "success_story_id", referencedColumnName = "id")
    private List<SuccessStoryMediaEntity> media;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "success_story_id", referencedColumnName = "id")
    private List<SuccessStoryHashtagEntity> hashtags;

    public SuccessStoryDm toDm() {
        var safeMedia = media == null ? List.<SuccessStoryMediaEntity>of() : media;
        var safeHashtags = hashtags == null ? List.<SuccessStoryHashtagEntity>of() : hashtags;
        return SuccessStoryDm.builder()
                .id(id)
                .orgId(orgId)
                .title(title)
                .body(body)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .medias(safeMedia.stream().map(m -> m.getMedia().toDm()).toList())
                .hashtags(safeHashtags.stream().map(h -> h.getHashtag().toDm()).toList())
                .build();
    }
}
