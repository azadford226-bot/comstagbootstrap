package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.BookmarkDm;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface BookmarkPort {
    void bookmark(UUID accountId, String targetType, UUID targetId);
    void unbookmark(UUID accountId, String targetType, UUID targetId);
    boolean isBookmarked(UUID accountId, String targetType, UUID targetId);
    Page<BookmarkDm> getBookmarks(UUID accountId, String targetType, int page, int size);
}
