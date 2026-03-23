package com.hivecontrolsolutions.comestag.infrastructure.persistence.repo;

import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.BookmarkEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BookmarkRepository extends JpaRepository<BookmarkEntity, UUID> {
    boolean existsByAccountIdAndTargetTypeAndTargetId(UUID accountId, String targetType, UUID targetId);
    void deleteByAccountIdAndTargetTypeAndTargetId(UUID accountId, String targetType, UUID targetId);
    Page<BookmarkEntity> findByAccountIdAndTargetType(UUID accountId, String targetType, Pageable pageable);
    Page<BookmarkEntity> findByAccountId(UUID accountId, Pageable pageable);
}
