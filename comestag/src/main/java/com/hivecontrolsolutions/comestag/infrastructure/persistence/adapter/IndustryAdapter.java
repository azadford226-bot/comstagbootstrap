package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.IndustryDm;
import com.hivecontrolsolutions.comestag.core.domain.port.IndustryPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.IndustryEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.IndustryRepository;
import lombok.RequiredArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.INDUSTRY_NOT_FOUND;

@Adapter
@RequiredArgsConstructor
public class IndustryAdapter implements IndustryPort {

    private final IndustryRepository industryRepository;

    @Override
    public IndustryDm getById(Long id) {
        IndustryEntity entity = industryRepository.findById(id)
                .orElseThrow(() -> new BusinessException(INDUSTRY_NOT_FOUND));
        return entity.toDm();
    }

    @Override
    public Set<IndustryDm> getAll() {
        return industryRepository.findAll().stream()
                .map(IndustryEntity::toDm)
                .collect(Collectors.toSet());
    }
}