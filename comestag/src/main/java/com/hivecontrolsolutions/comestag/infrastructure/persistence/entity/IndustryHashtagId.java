package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class IndustryHashtagId implements Serializable {

    @Column(name = "industry_id")
    private Long industryId;

    @Column(name = "hashtag_id")
    private Long hashtagId;
}