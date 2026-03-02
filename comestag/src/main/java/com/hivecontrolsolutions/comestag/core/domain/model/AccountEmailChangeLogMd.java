package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
public class AccountEmailChangeLogMd {
    private UUID id;
    private UUID accountId;
    private String oldEmail;
    private String newEmail;
    private Instant changedAt;

    public boolean isExpired(int emailChangeLogExpiry) {
        return changedAt.isAfter(Instant.now().plusSeconds(emailChangeLogExpiry));
    }
}
