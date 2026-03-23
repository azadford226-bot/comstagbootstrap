package com.hivecontrolsolutions.comestag.entrypoint.web.social;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.port.BookmarkPort;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/bookmarks")
public class BookmarkProcessor {

    private final BookmarkPort bookmarkPort;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/{targetType}/{targetId}")
    @Operation(summary = "Bookmark an item (POST, RFQ, etc.)")
    public ResponseEntity<?> bookmark(@CurrentUserId UUID currentUserId,
                                      @PathVariable String targetType,
                                      @PathVariable UUID targetId) {
        bookmarkPort.bookmark(currentUserId, targetType.toUpperCase(), targetId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/{targetType}/{targetId}")
    @Operation(summary = "Remove a bookmark")
    public ResponseEntity<?> unbookmark(@CurrentUserId UUID currentUserId,
                                        @PathVariable String targetType,
                                        @PathVariable UUID targetId) {
        bookmarkPort.unbookmark(currentUserId, targetType.toUpperCase(), targetId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{targetType}/{targetId}/status")
    @Operation(summary = "Check if current user has bookmarked an item")
    public ResponseEntity<?> isBookmarked(@CurrentUserId UUID currentUserId,
                                           @PathVariable String targetType,
                                           @PathVariable UUID targetId) {
        boolean bookmarked = bookmarkPort.isBookmarked(currentUserId, targetType.toUpperCase(), targetId);
        return ResponseEntity.ok(Map.of("bookmarked", bookmarked));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping
    @Operation(summary = "Get user's bookmarks")
    public ResponseEntity<?> getBookmarks(@CurrentUserId UUID currentUserId,
                                           @RequestParam(required = false) String targetType,
                                           @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(bookmarkPort.getBookmarks(currentUserId, targetType, page, size));
    }
}
