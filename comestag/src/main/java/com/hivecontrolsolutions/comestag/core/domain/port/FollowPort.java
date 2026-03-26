package com.hivecontrolsolutions.comestag.core.domain.port;

import java.util.List;
import java.util.UUID;

public interface FollowPort {
    void follow(UUID followerId, UUID followingId);
    void unfollow(UUID followerId, UUID followingId);
    boolean isFollowing(UUID followerId, UUID followingId);
    long countFollowers(UUID accountId);
    long countFollowing(UUID accountId);

    List<UUID> listFollowingIds(UUID followerId);
}
