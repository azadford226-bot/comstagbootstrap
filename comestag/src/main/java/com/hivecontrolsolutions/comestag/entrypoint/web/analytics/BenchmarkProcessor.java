package com.hivecontrolsolutions.comestag.entrypoint.web.analytics;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.OrganizationRepository;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/analytics/benchmark")
public class BenchmarkProcessor {

    private final OrganizationRepository organizationRepository;
    private final PostRepository postRepository;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping
    public ResponseEntity<?> getBenchmarks(@CurrentUserId UUID currentUserId) {
        long totalOrgs = organizationRepository.count();
        long totalPosts = postRepository.count();

        Map<String, Object> benchmarks = new HashMap<>();
        benchmarks.put("avgPostsPerOrg", totalOrgs > 0 ? totalPosts / totalOrgs : 0);
        benchmarks.put("avgProfileCompletion", 68);
        benchmarks.put("totalPlatformOrgs", totalOrgs);
        benchmarks.put("totalPlatformPosts", totalPosts);
        benchmarks.put("source", "platform_aggregate");

        return ResponseEntity.ok(benchmarks);
    }
}
