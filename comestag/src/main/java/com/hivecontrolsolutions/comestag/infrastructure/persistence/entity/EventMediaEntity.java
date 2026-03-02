package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_media")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventMediaEntity {

    @EmbeddedId
    private EventMediaId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "media_id",
            referencedColumnName = "id",
            insertable = false,
            updatable = false
    )
    private MediaEntity media;
}
