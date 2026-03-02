package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.port.PostMediaPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostMediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostMediaId;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.PostMediaRepository;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class PostMediaAdapter implements PostMediaPort {

    private final PostMediaRepository repo;

    @Override
    public void create(UUID postId, java.util.Set<UUID> mediaIds) {
        if (mediaIds == null || mediaIds.isEmpty()) return;
        repo.saveAll(
                mediaIds.stream()
                        .map(id -> PostMediaEntity.builder()
                                .id(new PostMediaId(postId, id))
                                .build())
                        .toList()
        );
    }

    @Override
    public void deleteByPostIdAndMediaIdIn(UUID postId, java.util.Set<UUID> mediaIds) {
        if (mediaIds == null || mediaIds.isEmpty()) return;
        repo.deleteByPostIdAndMediaIdIn(postId, mediaIds);
    }
}