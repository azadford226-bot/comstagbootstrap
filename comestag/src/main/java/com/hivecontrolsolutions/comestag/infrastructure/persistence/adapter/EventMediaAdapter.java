package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.port.EventMediaPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.EventMediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.EventMediaId;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.EventMediaRepository;
import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class EventMediaAdapter implements EventMediaPort {

    private final EventMediaRepository repo;

    @Override
    public void create(UUID eventId, Set<UUID> mediaIds) {
        repo.saveAll(
                mediaIds.stream()
                        .map(id -> EventMediaEntity.builder()
                                .id(new EventMediaId(eventId, id))
                                .build())
                        .toList()
        );
    }

    @Override
    public void deleteByEventIdAndMediaIdIn(UUID eventId, Set<UUID> mediaIds) {
        repo.deleteByEventIdAndMediaIdIn(eventId, mediaIds);
    }
}