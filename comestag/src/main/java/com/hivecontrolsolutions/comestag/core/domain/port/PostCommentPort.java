package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.PostCommentDm;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface PostCommentPort {

    PostCommentDm create(UUID postId,
                         UUID accountId,
                         String body,
                         UUID parentCommentId);

    void delete(UUID commentId, UUID accountId);

    Page<PostCommentDm> pageByPost(UUID postId, int page, int size);
}