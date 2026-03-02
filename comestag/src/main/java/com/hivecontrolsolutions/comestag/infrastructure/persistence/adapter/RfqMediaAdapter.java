package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqMediaPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqMediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqMediaId;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RfqMediaRepository;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class RfqMediaAdapter implements RfqMediaPort {

    private final RfqMediaRepository repo;

    @Override
    public void create(UUID rfqId, java.util.Set<UUID> mediaIds) {
        if (mediaIds == null || mediaIds.isEmpty()) return;
        repo.saveAll(
                mediaIds.stream()
                        .map(id -> RfqMediaEntity.builder()
                                .id(new RfqMediaId(rfqId, id))
                                .build())
                        .toList()
        );
    }

    @Override
    public void deleteByRfqIdAndMediaIdIn(UUID rfqId, java.util.Set<UUID> mediaIds) {
        if (mediaIds == null || mediaIds.isEmpty()) return;
        repo.deleteByRfqIdAndMediaIdIn(rfqId, mediaIds);
    }
}
