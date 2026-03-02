package com.hivecontrolsolutions.comestag.core.domain.service;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.infrastructure.config.EmailCheckProps;
import com.hivecontrolsolutions.comestag.core.domain.util.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.VALIDATION_FAILED;

@Service
@RequiredArgsConstructor
public class OrgEmailGuard {
    private final EmailCheckProps props;

    public void isIndividualEmail(String email) {
        String domain = EmailUtils.extractDomain(email);
        if (domain.isBlank()) {
            throw new BusinessException(VALIDATION_FAILED, "Invalid email format", List.of("email"));
        }

        final String normalizedDomain = domain.toLowerCase(Locale.ROOT);

        // 1) Exact domain block
        if (props.getBlockedDomains() != null
                && props.getBlockedDomains().stream()
                .filter(Objects::nonNull)
                .map(d -> d.toLowerCase(Locale.ROOT))
                .anyMatch(d -> d.equals(normalizedDomain))) {
            throw new BusinessException(VALIDATION_FAILED, "Email domain not allowed",List.of("email"));
        }

        // 2) Suffix block (e.g. .gmail.com)
        if (props.getBlockedSuffixes() != null) {
            for (String suf : props.getBlockedSuffixes()) {
                if (suf != null && !suf.isBlank()
                        && normalizedDomain.endsWith(suf.toLowerCase(Locale.ROOT))) {
                    throw new BusinessException(VALIDATION_FAILED, "Email domain not allowed",List.of("email"));
                }
            }
        }
    }


    public void hasMxRecords(String email) {
        try {
            var domain = EmailUtils.extractDomain(email);
            var env = new java.util.Hashtable<String, String>();
            env.put(javax.naming.Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.dns.DnsContextFactory");
            var ctx = new javax.naming.directory.InitialDirContext(env);
            var attrs = ctx.getAttributes(domain, new String[]{"MX"});
            var mx = attrs.get("MX");
            if (mx == null || mx.size() <= 0)
                throw new BusinessException(VALIDATION_FAILED, "Email not real organization",List.of("email"));
        } catch (Exception e) {
            throw new BusinessException(VALIDATION_FAILED, "Email not real organization",List.of("email"));
        }
    }
}