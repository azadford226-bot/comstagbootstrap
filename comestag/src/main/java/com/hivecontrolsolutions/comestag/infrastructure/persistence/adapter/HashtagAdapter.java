package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.HashtagDm;
import com.hivecontrolsolutions.comestag.core.domain.port.HashtagPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.HashtagEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.HashtagRepository;
import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Adapter
@RequiredArgsConstructor
public class HashtagAdapter implements HashtagPort {
    private final HashtagRepository hashtagRepository;

    @Override
    public Set<HashtagDm> getByIds(Set<Long> ids) {
        return hashtagRepository.findByIdIn(ids)
                .stream()
                .map(HashtagEntity::toDm)
                .collect(Collectors.toSet());
    }

    @Override
    public Set<HashtagDm> getAll() {
        return hashtagRepository.findAll()
                .stream()
                .map(HashtagEntity::toDm)
                .collect(Collectors.toSet());
    }
}
