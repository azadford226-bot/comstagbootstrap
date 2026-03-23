package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.BookmarkDm;
import com.hivecontrolsolutions.comestag.core.domain.port.BookmarkPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.BookmarkEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@RequiredArgsConstructor
@Adapter
public class BookmarkAdapter implements BookmarkPort {
    private final BookmarkRepository repo;

    @Transactional
    @Override
    public void bookmark(UUID accountId, String targetType, UUID targetId) {
        if (!repo.existsByAccountIdAndTargetTypeAndTargetId(accountId, targetType, targetId)) {
            repo.save(BookmarkEntity.builder()
                    .accountId(accountId)
                    .targetType(targetType)
                    .targetId(targetId)
                    .build());
        }
    }

    @Transactional
    @Override
    public void unbookmark(UUID accountId, String targetType, UUID targetId) {
        repo.deleteByAccountIdAndTargetTypeAndTargetId(accountId, targetType, targetId);
    }

    @Override
    public boolean isBookmarked(UUID accountId, String targetType, UUID targetId) {
        return repo.existsByAccountIdAndTargetTypeAndTargetId(accountId, targetType, targetId);
    }

    @Override
    public Page<BookmarkDm> getBookmarks(UUID accountId, String targetType, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (targetType != null && !targetType.isEmpty()) {
            return repo.findByAccountIdAndTargetType(accountId, targetType, pageable)
                    .map(BookmarkEntity::toDm);
        }
        return repo.findByAccountId(accountId, pageable)
                .map(BookmarkEntity::toDm);
    }
}
