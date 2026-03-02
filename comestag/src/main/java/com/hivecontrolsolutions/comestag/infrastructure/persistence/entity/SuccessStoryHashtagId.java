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
public class SuccessStoryHashtagId implements Serializable {

    @Column(name = "success_story_id")
    private UUID successStoryId;

    @Column(name = "hashtag_id")
    private Long hashtagId;
}