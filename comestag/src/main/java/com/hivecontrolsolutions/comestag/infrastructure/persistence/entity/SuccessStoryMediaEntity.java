package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.SuccessStoryMediaDm;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "success_story_media")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SuccessStoryMediaEntity {

    @EmbeddedId
    private SuccessStoryMediaId id;

    // Optional: navigation to SuccessStory (read-only)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "success_story_id",
            referencedColumnName = "id",
            insertable = false,
            updatable = false
    )
    private SuccessStoryEntity successStory;

    // Optional: navigation to Media (read-only)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "media_id",
            referencedColumnName = "id",
            insertable = false,
            updatable = false
    )
    private MediaEntity media;

    public SuccessStoryMediaDm toDm() {
        return SuccessStoryMediaDm.builder()
                .successStoryId(id.getSuccessStoryId())
                // if you want full MediaDm and expect `media` to be loaded:
                .media(media != null ? media.toDm() : null)
                .build();
    }
}