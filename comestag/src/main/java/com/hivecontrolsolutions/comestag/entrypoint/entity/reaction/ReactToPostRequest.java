package com.hivecontrolsolutions.comestag.entrypoint.entity.reaction;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.PostReactionType;
import jakarta.validation.constraints.NotNull;

public record ReactToPostRequest(
        @NotNull PostReactionType reaction
) {}
