package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.core.domain.port.SuccessStoryMediaPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryMediaEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryMediaId;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.SuccessStoryMediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SuccessStoryMediaAdapter implements SuccessStoryMediaPort {

    private final SuccessStoryMediaRepository successStoryMediaRepository;

    @Override
    public void create(UUID successStoryId, Set<UUID> mediaIds) {
        successStoryMediaRepository.saveAll(
                mediaIds.stream()
                        .map(mediaId ->
                                SuccessStoryMediaEntity.builder()
                                        .id(new SuccessStoryMediaId(successStoryId, mediaId))
                                        .build()
                        )
                        .toList());
    }

    @Override
    public void deleteBySuccessStoryIdAndMediaIdIn(UUID successStoryId, Set<UUID> mediaIds) {
        successStoryMediaRepository.deleteBySuccessStoryIdAndMediaIdIn(successStoryId, mediaIds);
    }
}
