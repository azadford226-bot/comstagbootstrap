package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.UUID;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RfqMediaId implements Serializable {

    @Column(name = "rfq_id")
    private UUID rfqId;

    @Column(name = "media_id")
    private UUID mediaId;
}
