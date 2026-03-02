package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "post_media")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostMediaEntity {

    @EmbeddedId
    private PostMediaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "media_id", insertable = false, updatable = false)
    private MediaEntity media;
}
