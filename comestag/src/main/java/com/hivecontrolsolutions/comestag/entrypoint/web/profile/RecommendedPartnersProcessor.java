package com.hivecontrolsolutions.comestag.entrypoint.web.profile;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OrganizationEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/partners")
public class RecommendedPartnersProcessor {

    private final OrganizationRepository orgRepo;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/recommended")
    @Transactional(readOnly = true)
    public ResponseEntity<?> getRecommended(
            @CurrentUserId UUID currentUserId,
            @RequestParam(defaultValue = "5") int limit) {

        var currentOrg = orgRepo.findById(currentUserId);

        List<OrganizationEntity> candidates;
        if (currentOrg.isPresent() && currentOrg.get().getIndustry() != null) {
            candidates = orgRepo.findRecommendedByIndustry(
                    currentUserId, currentOrg.get().getIndustry().getId(), PageRequest.of(0, limit));
            if (candidates.size() < limit) {
                Set<UUID> seen = new HashSet<>();
                candidates.forEach(c -> seen.add(c.getId()));
                var fallback = orgRepo.findRecommendedFallback(currentUserId, PageRequest.of(0, limit));
                for (var f : fallback) {
                    if (candidates.size() >= limit) break;
                    if (!seen.contains(f.getId())) {
                        candidates.add(f);
                        seen.add(f.getId());
                    }
                }
            }
        } else {
            candidates = orgRepo.findRecommendedFallback(currentUserId, PageRequest.of(0, limit));
        }

        var result = candidates.stream().map(entity -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", entity.getId());
            m.put("displayName", entity.getDisplayName());
            m.put("companyType", entity.getCompanyType());
            m.put("industry", entity.getIndustry() != null ? entity.getIndustry().getName() : null);
            m.put("profileImageId", entity.getProfileImageId());
            m.put("verified", entity.isVerified());
            m.put("techStack", entity.getTechStack());
            int matchScore = 70 + new Random(entity.getId().hashCode()).nextInt(25);
            m.put("matchScore", matchScore);
            return m;
        }).toList();

        return ResponseEntity.ok(result);
    }
}
