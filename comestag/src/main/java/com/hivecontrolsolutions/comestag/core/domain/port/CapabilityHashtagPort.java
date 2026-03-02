package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.Set;
import java.util.UUID;

public interface CapabilityHashtagPort {

    void create(UUID capabilityId, Set<Long> hashtagIds);

    void deleteByCapabilityIdAndHashtagIdIn(UUID capabilityId, Set<Long> hashtagIds);
}

