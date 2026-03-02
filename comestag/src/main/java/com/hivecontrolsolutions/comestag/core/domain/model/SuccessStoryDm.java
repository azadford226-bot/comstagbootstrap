package com.hivecontrolsolutions.comestag.core.domain.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
@Builder
public class SuccessStoryDm {
    private UUID id;
    @JsonIgnore
    private UUID orgId;
    private String title;
    private String body;
    private Instant createdAt;
    private Instant updatedAt;
    private List<MediaDm> medias;
    private List<HashtagDm> hashtags;
}
