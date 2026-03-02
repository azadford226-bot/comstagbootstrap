package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.SuccessStoryDm;
import com.hivecontrolsolutions.comestag.core.domain.port.SuccessStoryPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.SuccessStoryEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.SuccessStoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.SUCCESS_STORY_NOT_EXIST;

@Adapter
@RequiredArgsConstructor
public class SuccessStoryAdapter implements SuccessStoryPort {
    private final SuccessStoryRepository repo;

    @Override
    public SuccessStoryDm getById(UUID id) {
        return repo.findById(id).
                orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST))
                .toDm();
    }

    @Override
    public SuccessStoryDm getByOrgIdAndId(UUID orgId, UUID id) {
        return repo.findByIdAndOrgId(id, orgId)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST))
                .toDm();
    }

    @Override
    public SuccessStoryDm create(UUID orgAccountId, String title, String body) {
        SuccessStoryEntity successStoryEntity = SuccessStoryEntity.builder()
                .orgId(orgAccountId)
                .title(title)
                .body(body)
                .build();

        return repo.save(successStoryEntity).toDm();
    }


    @Override
    public int update(UUID storyId, String title, String body) {
        return repo.updateTitleAndBodyById(storyId, title, body);
    }

    @Override
    @Transactional
    public void delete(UUID storyId, UUID orgAccountId) {
        repo.deleteByIdAndOrgId(storyId, orgAccountId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SuccessStoryDm> pageByOrganization(UUID orgId, int page, int size) {
        return repo.findByOrgId(orgId, PageRequest.of(page, size))
                .map(SuccessStoryEntity::toDm);
    }

}
