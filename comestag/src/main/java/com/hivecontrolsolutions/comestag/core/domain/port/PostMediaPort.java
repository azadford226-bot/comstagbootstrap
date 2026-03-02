package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.Set;
import java.util.UUID;

public interface PostMediaPort {
    void create(UUID postId, Set<UUID> mediaIds);
    void deleteByPostIdAndMediaIdIn(UUID postId, Set<UUID> mediaIds);
}