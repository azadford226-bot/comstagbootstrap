package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.AccountEmailChangeLogMd;

import java.util.Optional;
import java.util.UUID;

public interface AccountEmailChangeLogPort {
    Optional<AccountEmailChangeLogMd> getLatestEmailChangeLog(UUID accountId);
}