package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EventMediaId implements Serializable {

    @Column(name = "event_id")
    private UUID eventId;

    @Column(name = "media_id")
    private UUID mediaId;
}
