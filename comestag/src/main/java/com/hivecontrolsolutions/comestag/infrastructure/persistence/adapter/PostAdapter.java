package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.PostDm;
import com.hivecontrolsolutions.comestag.core.domain.port.PostPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.SUCCESS_STORY_NOT_EXIST;

@Adapter
@RequiredArgsConstructor
public class PostAdapter implements PostPort {

    private final PostRepository repo;

    @Override
    public PostDm getById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST))
                .toDm();
    }

    @Override
    public PostDm getByOrgIdAndId(UUID orgId, UUID id) {
        return repo.findByIdAndOrgId(id, orgId)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST))
                .toDm();
    }

    @Override
    public PostDm create(UUID orgId, String body) {
        var e = PostEntity.builder()
                .orgId(orgId)
                .body(body)
                .build();
        return repo.save(e).toDm();
    }

    @Override
    public int update(UUID postId, String body) {
        return repo.updateBody(postId, body);
    }

    @Override
    @Transactional
    public void delete(UUID postId, UUID orgId) {
        repo.deleteByIdAndOrgId(postId, orgId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDm> pageByOrganization(UUID orgId, int page, int size) {
        return repo.findByOrgId(orgId, PageRequest.of(page, size))
                .map(PostEntity::toDm);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostDm> pageLatest(int page, int size) {
        return repo.findLatest(PageRequest.of(page, size))
                .map(PostEntity::toDm);
    }

    @Override
    public void increaseViewCount(UUID postId) {
        repo.incrementViews(postId);
    }
}