package com.hivecontrolsolutions.comestag.entrypoint.web.verification;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.DomainVerificationEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.DomainVerificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.time.Instant;
import java.util.*;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/verification/domain")
public class DomainVerificationProcessor {

    private final DomainVerificationRepository repository;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiate(
            @CurrentUserId UUID currentUserId,
            @RequestBody Map<String, String> body) {
        String domain = body.get("domain");
        if (domain == null || domain.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "domain is required"));
        }

        domain = domain.toLowerCase().trim();
        var existing = repository.findByOrgIdAndDomain(currentUserId, domain);
        if (existing.isPresent()) {
            var e = existing.get();
            return ResponseEntity.ok(Map.of(
                    "domain", e.getDomain(),
                    "token", e.getVerificationToken(),
                    "method", e.getVerificationMethod(),
                    "verified", e.isVerified(),
                    "instruction", "Add a DNS TXT record: comstag-verify=" + e.getVerificationToken()
            ));
        }

        String token = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        var entity = DomainVerificationEntity.builder()
                .orgId(currentUserId)
                .domain(domain)
                .verificationToken(token)
                .build();
        repository.save(entity);

        return ResponseEntity.ok(Map.of(
                "domain", domain,
                "token", token,
                "method", "DNS_TXT",
                "instruction", "Add a DNS TXT record to " + domain + " with value: comstag-verify=" + token
        ));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/check")
    public ResponseEntity<Map<String, Object>> check(
            @CurrentUserId UUID currentUserId,
            @RequestBody Map<String, String> body) {
        String domain = body.get("domain");
        if (domain == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "domain required"));
        }

        var opt = repository.findByOrgIdAndDomain(currentUserId, domain.toLowerCase().trim());
        if (opt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No verification initiated for this domain"));
        }

        var entity = opt.get();
        if (entity.isVerified()) {
            return ResponseEntity.ok(Map.of("verified", true, "domain", domain));
        }

        String expectedValue = "comstag-verify=" + entity.getVerificationToken();
        boolean found = checkDnsTxtRecord(domain, expectedValue);

        if (found) {
            entity.setVerified(true);
            entity.setVerifiedAt(Instant.now());
            repository.save(entity);
            return ResponseEntity.ok(Map.of("verified", true, "domain", domain));
        }

        return ResponseEntity.ok(Map.of(
                "verified", false,
                "domain", domain,
                "message", "TXT record not found. Please ensure you added: " + expectedValue
        ));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/status")
    public ResponseEntity<List<Map<String, Object>>> status(@CurrentUserId UUID currentUserId) {
        var verifications = repository.findByOrgId(currentUserId);
        var result = verifications.stream().map(v -> {
            Map<String, Object> m = new HashMap<>();
            m.put("domain", v.getDomain());
            m.put("verified", v.isVerified());
            m.put("verifiedAt", v.getVerifiedAt() != null ? v.getVerifiedAt().toString() : null);
            m.put("token", v.getVerificationToken());
            m.put("method", v.getVerificationMethod());
            return m;
        }).toList();
        return ResponseEntity.ok(result);
    }

    private boolean checkDnsTxtRecord(String domain, String expectedValue) {
        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put("java.naming.factory.initial", "com.sun.jndi.dns.DnsContextFactory");
            DirContext ctx = new InitialDirContext(env);
            Attributes attrs = ctx.getAttributes(domain, new String[]{"TXT"});
            var txtRecords = attrs.get("TXT");
            if (txtRecords != null) {
                for (int i = 0; i < txtRecords.size(); i++) {
                    String record = txtRecords.get(i).toString().replace("\"", "");
                    if (record.contains(expectedValue)) {
                        return true;
                    }
                }
            }
            ctx.close();
        } catch (Exception e) {
            // DNS lookup failed — not verified
        }
        return false;
    }
}
