package com.hivecontrolsolutions.comestag.entrypoint.web.social;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.port.FollowPort;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/follow")
public class FollowProcessor {

    private final FollowPort followPort;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/{targetId}")
    @Operation(summary = "Follow a company/user")
    public ResponseEntity<?> follow(@CurrentUserId UUID currentUserId,
                                    @PathVariable UUID targetId) {
        followPort.follow(currentUserId, targetId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/{targetId}")
    @Operation(summary = "Unfollow a company/user")
    public ResponseEntity<?> unfollow(@CurrentUserId UUID currentUserId,
                                      @PathVariable UUID targetId) {
        followPort.unfollow(currentUserId, targetId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{targetId}/status")
    @Operation(summary = "Check if current user follows a target")
    public ResponseEntity<?> isFollowing(@CurrentUserId UUID currentUserId,
                                         @PathVariable UUID targetId) {
        boolean following = followPort.isFollowing(currentUserId, targetId);
        return ResponseEntity.ok(Map.of("following", following));
    }

    @GetMapping("/{targetId}/counts")
    @Operation(summary = "Get follower/following counts for a user")
    public ResponseEntity<?> getCounts(@PathVariable UUID targetId) {
        long followers = followPort.countFollowers(targetId);
        long following = followPort.countFollowing(targetId);
        return ResponseEntity.ok(Map.of("followers", followers, "following", following));
    }
}
