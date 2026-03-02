package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.PostReactionDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.PostReactionType;

import java.util.UUID;

public interface PostReactionPort {

    PostReactionDm react(UUID postId,
                         UUID accountId,
                         PostReactionType reactionType);

    void removeReaction(UUID postId,
                        UUID accountId);
}