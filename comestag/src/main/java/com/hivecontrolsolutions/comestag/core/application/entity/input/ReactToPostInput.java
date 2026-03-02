package com.hivecontrolsolutions.comestag.core.application.entity.input;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.PostReactionType;
import lombok.Builder;

import java.util.UUID;

@Builder
public record ReactToPostInput(
        UUID postId,
        UUID accountId,
        PostReactionType reaction
) {}
