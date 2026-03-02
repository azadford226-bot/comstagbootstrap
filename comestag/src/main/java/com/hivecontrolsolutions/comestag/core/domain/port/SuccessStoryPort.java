package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.SuccessStoryDm;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface SuccessStoryPort {
    SuccessStoryDm getById(UUID id);
    SuccessStoryDm getByOrgIdAndId(UUID orgId, UUID id);

    SuccessStoryDm create(UUID orgAccountId,
                          String title,
                          String body);

    int update(UUID storyId,
                          String title,
                          String body);

    void delete(UUID storyId, UUID orgAccountId);

    Page<SuccessStoryDm> pageByOrganization(UUID orgId, int page, int size);

}
