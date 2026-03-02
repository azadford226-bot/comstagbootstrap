package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus;

import java.util.Optional;
import java.util.UUID;

public interface AccountPort {
    Optional<AccountDm> getByEmail(String email);

    AccountDm save(AccountDm account);

    void updatePassword(UUID userid, String hashPassword);

    Optional<AccountDm> getById(UUID id);

    void activate(AccountStatus status, UUID userId);

    void verifyEmail(UUID userId);

    void updateEmail(UUID id, String email);

    void updateAccountName(UUID id, String displayName);

    void restoreEmail(UUID id, String email);

    //is active
    boolean isActive(UUID id);
    
    long countByType(com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType type);
}
