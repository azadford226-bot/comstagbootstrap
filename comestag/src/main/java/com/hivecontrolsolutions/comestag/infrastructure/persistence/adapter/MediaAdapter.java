package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError;
import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.MediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.MediaRepository;
import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Adapter
@RequiredArgsConstructor
public class MediaAdapter implements MediaPort {
    private final MediaRepository repo;

    @Override
    public MediaDm save(MediaDm media) {
        var e = MediaEntity.builder()
                .ownerAccountId(media.getOwnerAccountId())
                .uri(media.getUri())
                .mediaType(media.getMediaType())
                .status(media.getStatus())
                .build();
        return repo.saveAndFlush(e).toDm();
    }

    @Override
    public MediaDm getById(UUID mediaId) {
        return repo.findById(mediaId)
                .orElseThrow(() -> new BusinessException(InternalStatusError.MEDIA_NOT_EXIST))
                .toDm();
    }

    @Override
    public Set<MediaDm> getExistingIdsByOrgIdAndIdIn(UUID accountOwnerId, Set<UUID> ids) {
        return repo.findIdsByOwnerAccountIdAndIdIn(accountOwnerId, ids).stream().map(MediaEntity::toDm).collect(Collectors.toSet());
    }

    @Override
    public MediaDm getByIdAndOwnerAccountId(UUID mediaId, UUID ownerAccountId) {
        return repo.findByIdAndOwnerAccountId(mediaId, ownerAccountId)
                .orElseThrow(() -> new BusinessException(InternalStatusError.MEDIA_NOT_EXIST))
                .toDm();
    }

    @Override
    public boolean isExists(UUID mediaId, UUID ownerAccountId) {
        return repo.existsByIdAndOwnerAccountId(mediaId, ownerAccountId);

    }

}

