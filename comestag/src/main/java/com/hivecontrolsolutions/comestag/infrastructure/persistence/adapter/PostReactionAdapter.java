package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.PostReactionDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.PostReactionType;
import com.hivecontrolsolutions.comestag.core.domain.port.PostReactionPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostReactionEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.PostReactionRepository;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class PostReactionAdapter implements PostReactionPort {

    private final PostReactionRepository repo;

    @Override
    public PostReactionDm react(UUID postId, UUID accountId, PostReactionType reactionType) {
        var existing = repo.findByPostIdAndAccountId(postId, accountId);

        if (existing.isPresent()) {
            var r = existing.get();
            r.setReaction(reactionType);
            return repo.save(r).toDm();
        }

        var e = PostReactionEntity.builder()
                .postId(postId)
                .accountId(accountId)
                .reaction(reactionType)
                .build();
        return repo.save(e).toDm();
    }

    @Override
    public void removeReaction(UUID postId, UUID accountId) {
        repo.findByPostIdAndAccountId(postId, accountId)
                .ifPresent(repo::delete);
    }
}