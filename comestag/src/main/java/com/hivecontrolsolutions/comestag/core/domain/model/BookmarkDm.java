package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class BookmarkDm {
    private UUID id;
    private UUID accountId;
    private String targetType;
    private UUID targetId;
    private Instant createdAt;
}
