package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.Set;
import java.util.UUID;

public interface SuccessStoryMediaPort {
    void create(UUID successStoryId, Set<UUID> mediaId);
    void deleteBySuccessStoryIdAndMediaIdIn(UUID successStoryId, Set<UUID> mediaIds);
}
