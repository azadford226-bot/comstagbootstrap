package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.port.CapabilityHashtagPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.CapabilityHashtagEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.CapabilityHashtagId;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.CapabilityHashtagRepository;
import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class CapabilityHashtagAdapter implements CapabilityHashtagPort {

    private final CapabilityHashtagRepository repo;

    @Override
    public void create(UUID capabilityId, Set<Long> hashtagIds) {
        if (hashtagIds == null || hashtagIds.isEmpty()) {
            return;
        }

        repo.saveAll(
                hashtagIds.stream()
                        .map(id -> CapabilityHashtagEntity.builder()
                                .id(new CapabilityHashtagId(capabilityId, id))
                                .build()
                        )
                        .toList()
        );
    }

    @Override
    public void deleteByCapabilityIdAndHashtagIdIn(UUID capabilityId, Set<Long> hashtagIds) {
        if (hashtagIds == null || hashtagIds.isEmpty()) {
            return;
        }
        repo.deleteByCapabilityIdAndHashtagIdIn(capabilityId, hashtagIds);
    }
}