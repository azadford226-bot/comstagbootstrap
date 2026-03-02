package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "industry_hashtags")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IndustryHashtagEntity {

    @EmbeddedId
    private IndustryHashtagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("industryId")
    @JoinColumn(name = "industry_id", insertable = false, updatable = false)
    private IndustryEntity industry;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("hashtagId")
    @JoinColumn(name = "hashtag_id", insertable = false, updatable = false)
    private HashtagEntity hashtag;
}