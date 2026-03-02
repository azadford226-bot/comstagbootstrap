package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.Set;
import java.util.UUID;

public interface EventMediaPort {
    void create(UUID eventId, Set<UUID> mediaIds);
    void deleteByEventIdAndMediaIdIn(UUID eventId, Set<UUID> mediaIds);
}