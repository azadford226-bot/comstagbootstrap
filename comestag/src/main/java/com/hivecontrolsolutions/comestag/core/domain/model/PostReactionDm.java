package com.hivecontrolsolutions.comestag.core.domain.model;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.PostReactionType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
public class PostReactionDm {

    private UUID id;
    private UUID postId;
    private UUID accountId;
    private PostReactionType reaction;
    private Instant createdAt;
    private Instant updatedAt;
}