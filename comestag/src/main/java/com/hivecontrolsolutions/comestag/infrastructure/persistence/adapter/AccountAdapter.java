package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;


import com.hivecontrolsolutions.comestag.base.core.error.exception.TechnicalException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.AccountEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.AccountRepository;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.AccountEntity.fromDm;

@RequiredArgsConstructor
@Adapter
public class AccountAdapter implements AccountPort {
    private final AccountRepository accountRepository;

    @Override
    public Optional<AccountDm> getByEmail(String email) {
        return accountRepository.findByEmail(email).map(AccountEntity::toDm);
    }

    @Override
    public AccountDm save(AccountDm accountDm) {
        var entity = fromDm(accountDm);

        return accountRepository.save(entity).toDm();
    }

    @Override
    public void updatePassword(UUID userid, String hashPassword) {
        int updated = accountRepository.updatePasswordHash(userid, hashPassword);
        if (updated == 0) throw new TechnicalException("Account not found");
    }


    @Override
    public Optional<AccountDm> getById(UUID id) {
        return accountRepository.findById(id).map(AccountEntity::toDm);
    }

    @Override
    public void activate(AccountStatus status, UUID userId) {
        int updated = accountRepository.changeStatus(status, userId);
        if (updated == 0) throw new TechnicalException("Account not found");
    }

    @Override
    public void verifyEmail(UUID userId) {
        int updated = accountRepository.verifyEmail( userId);
        if (updated == 0) throw new TechnicalException("Account not found");
    }

    @Override
    public void updateAccountName(UUID id, String displayName) {
        accountRepository.updateDisplayName(id, displayName);
    }

    @Override
    public void updateEmail(UUID id, String email) {
        accountRepository.updateEmail(id, email);
    }

    @Override
    public void restoreEmail(UUID id, String email) {
        accountRepository.restoreEmail(id, email);
    }

    @Override
    public boolean isActive(UUID id) {
        return accountRepository.findById(id).map(accountEntity -> AccountStatus.ACTIVE.equals(accountEntity.getStatus())).orElse(false);
    }
    
    @Override
    public long countByType(com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType type) {
        return accountRepository.countByType(type);
    }
}
