package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;

import java.util.Set;
import java.util.UUID;

public interface MediaPort {
    MediaDm save(MediaDm media);

    MediaDm getById(UUID mediaId);

    Set<MediaDm> getExistingIdsByOrgIdAndIdIn(UUID orgId, Set<UUID> ids);

    MediaDm getByIdAndOwnerAccountId(UUID mediaId, UUID ownerAccountId);

    boolean isExists(UUID mediaId, UUID ownerAccountId);
}