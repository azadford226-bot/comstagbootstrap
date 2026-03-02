package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.PostDm;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface PostPort {

    PostDm getById(UUID id);

    PostDm getByOrgIdAndId(UUID orgId, UUID id);

    PostDm create(UUID orgId,
                  String body);

    int update(UUID postId,
               String body);

    void delete(UUID postId, UUID orgId);

    Page<PostDm> pageByOrganization(UUID orgId, int page, int size);

    Page<PostDm> pageLatest(int page, int size);

    void increaseViewCount(UUID postId);
}