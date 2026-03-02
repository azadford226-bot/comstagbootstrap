package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostMediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostMediaId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;
import java.util.UUID;

public interface PostMediaRepository extends JpaRepository<PostMediaEntity, PostMediaId> {

    @Modifying
    @Query("""
            DELETE FROM PostMediaEntity p
            WHERE p.id.postId = :postId
              AND p.id.mediaId IN :mediaIds
            """)
    int deleteByPostIdAndMediaIdIn(UUID postId, Set<UUID> mediaIds);
}