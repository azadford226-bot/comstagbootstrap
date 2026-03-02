package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "capability_hashtags")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CapabilityHashtagEntity {

    @EmbeddedId
    private CapabilityHashtagId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtag_id", insertable = false, updatable = false)
    private HashtagEntity hashtag;
}