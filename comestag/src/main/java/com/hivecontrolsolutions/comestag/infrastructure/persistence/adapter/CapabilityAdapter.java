package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.CapabilityDm;
import com.hivecontrolsolutions.comestag.core.domain.port.CapabilityPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.CapabilityEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.CapabilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.SUCCESS_STORY_NOT_EXIST;

@Adapter
@RequiredArgsConstructor
public class CapabilityAdapter implements CapabilityPort {

    private final CapabilityRepository repo;

    @Override
    public CapabilityDm getById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST)) // you may want a new enum for capability
                .toDm();
    }

    @Override
    public CapabilityDm getByOrgIdAndId(UUID orgId, UUID id) {
        return repo.findByIdAndOrgId(id, orgId)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST))
                .toDm();
    }

    @Override
    public CapabilityDm create(UUID orgAccountId, String title, String body) {
        CapabilityEntity e = CapabilityEntity.builder()
                .orgId(orgAccountId)
                .title(title)
                .body(body)
                .build();

        return repo.save(e).toDm();
    }

    @Override
    public int update(UUID capabilityId, String title, String body) {
        return repo.updateTitleAndBodyById(capabilityId, title, body);
    }

    @Override
    @Transactional
    public void delete(UUID capabilityId, UUID orgAccountId) {
        repo.deleteByIdAndOrgId(capabilityId, orgAccountId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CapabilityDm> pageByOrganization(UUID orgId, int page, int size) {
        return repo.findByOrgId(orgId, PageRequest.of(page, size))
                .map(CapabilityEntity::toDm);
    }
}
