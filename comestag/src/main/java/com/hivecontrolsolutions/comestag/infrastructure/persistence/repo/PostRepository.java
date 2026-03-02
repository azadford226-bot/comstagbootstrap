package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface PostRepository extends JpaRepository<PostEntity, UUID> {

    @Modifying
    @Query("""
            DELETE FROM PostEntity p
            WHERE p.id = :id
              AND p.orgId = :orgId
            """)
    void deleteByIdAndOrgId(@Param("id") UUID id,
                            @Param("orgId") UUID orgId);

    Optional<PostEntity> findByIdAndOrgId(UUID id, UUID orgId);

    @Modifying
    @Query("""
            UPDATE PostEntity p
            SET p.body  = :body
            WHERE p.id = :id
            """)
    int updateBody(@Param("id") UUID id,
                           @Param("body") String body);

    @Modifying
    @Query("""
            UPDATE PostEntity p
            SET p.views = p.views + 1
            WHERE p.id = :id
            """)
    void incrementViews(@Param("id") UUID id);

    Page<PostEntity> findByOrgId(UUID orgId, Pageable pageable);

    @Query("""
            SELECT p
            FROM PostEntity p
            ORDER BY p.createdAt DESC
            """)
    Page<PostEntity> findLatest(Pageable pageable);
}
