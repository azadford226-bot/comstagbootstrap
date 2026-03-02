package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
public class PostDm {

    private UUID id;
    private UUID orgId;

    private String body;

    private long reactionsCount;
    private long commentsCount;
    private Long views;

    private Instant createdAt;
    private Instant updatedAt;

    private List<MediaDm> media;
}