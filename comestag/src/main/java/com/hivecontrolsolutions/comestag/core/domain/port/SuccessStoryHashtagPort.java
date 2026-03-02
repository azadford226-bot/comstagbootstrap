package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.Set;
import java.util.UUID;

public interface SuccessStoryHashtagPort {
    void create(UUID successStoryId, Set<Long> hashtagIds);

    void deleteBySuccessStoryIdAndHashtagIdIn(UUID successStoryId, Set<Long> hashtagIds);
}
