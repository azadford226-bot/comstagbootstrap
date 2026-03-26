package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.port.FollowPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.FollowEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Adapter
public class FollowAdapter implements FollowPort {
    private final FollowRepository repo;

    @Transactional
    @Override
    public void follow(UUID followerId, UUID followingId) {
        if (!repo.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            repo.save(FollowEntity.builder()
                    .followerId(followerId)
                    .followingId(followingId)
                    .build());
        }
    }

    @Transactional
    @Override
    public void unfollow(UUID followerId, UUID followingId) {
        repo.deleteByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public boolean isFollowing(UUID followerId, UUID followingId) {
        return repo.existsByFollowerIdAndFollowingId(followerId, followingId);
    }

    @Override
    public long countFollowers(UUID accountId) {
        return repo.countByFollowingId(accountId);
    }

    @Override
    public long countFollowing(UUID accountId) {
        return repo.countByFollowerId(accountId);
    }

    @Override
    public List<UUID> listFollowingIds(UUID followerId) {
        return repo.findByFollowerId(followerId).stream()
                .map(FollowEntity::getFollowingId)
                .toList();
    }
}
