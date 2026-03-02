package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.PostReactionType;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostReactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PostReactionRepository extends JpaRepository<PostReactionEntity, UUID> {

    Optional<PostReactionEntity> findByPostIdAndAccountId(UUID postId, UUID accountId);

    boolean existsByPostIdAndAccountIdAndReaction(UUID postId,
                                                  UUID accountId,
                                                  PostReactionType reaction);
}