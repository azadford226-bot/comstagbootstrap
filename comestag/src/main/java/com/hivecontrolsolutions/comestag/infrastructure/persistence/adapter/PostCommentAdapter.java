package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.PostCommentDm;
import com.hivecontrolsolutions.comestag.core.domain.port.PostCommentPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.PostCommentEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.PostCommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class PostCommentAdapter implements PostCommentPort {

    private final PostCommentRepository repo;

    @Override
    public PostCommentDm create(UUID postId, UUID accountId, String body, UUID parentCommentId) {
        var e = PostCommentEntity.builder()
                .postId(postId)
                .accountId(accountId)
                .body(body)
                .parentCommentId(parentCommentId)
                .build();
        return repo.save(e).toDm();
    }

    @Override
    public void delete(UUID commentId, UUID accountId) {
        // simple version: only owner can delete
        repo.findById(commentId).ifPresent(comment -> {
            if (comment.getAccountId().equals(accountId)) {
                repo.delete(comment);
            }
        });
    }

    @Override
    public Page<PostCommentDm> pageByPost(UUID postId, int page, int size) {
        return repo.findByPostIdOrderByCreatedAtAsc(postId, PageRequest.of(page, size))
                .map(PostCommentEntity::toDm);
    }
}