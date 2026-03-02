package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.Set;
import java.util.UUID;

public interface RfqMediaPort {
    void create(UUID rfqId, Set<UUID> mediaIds);
    void deleteByRfqIdAndMediaIdIn(UUID rfqId, Set<UUID> mediaIds);
}
