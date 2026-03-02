package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "success_story_hashtags")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SuccessStoryHashtagEntity {

    @EmbeddedId
    private SuccessStoryHashtagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtag_id", insertable = false, updatable = false)
    private HashtagEntity hashtag;
}
