package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.port.SuccessStoryHashtagPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryHashtagEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryHashtagId;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.SuccessStoryHashtagRepository;
import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class SuccessStoryHashtagAdapter implements SuccessStoryHashtagPort {

    private final SuccessStoryHashtagRepository successStoryHashtagRepository;

    @Override
    public void create(UUID successStoryId, Set<Long> hashtagIds) {
        successStoryHashtagRepository.saveAll(
                hashtagIds.stream()
                        .map(hashtagId ->
                                SuccessStoryHashtagEntity.builder()
                                        .id(new SuccessStoryHashtagId(successStoryId, hashtagId))
                                        .build()
                        )
                        .toList());
    }

    @Override
    public void deleteBySuccessStoryIdAndHashtagIdIn(UUID successStoryId, Set<Long> hashtagIds) {
        successStoryHashtagRepository.deleteBySuccessStoryIdAndHashtagIdIn(successStoryId, hashtagIds);
    }
}
