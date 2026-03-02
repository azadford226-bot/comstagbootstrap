package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountEmailChangeLogMd;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountEmailChangeLogPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.AccountEmailChangeLogEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.AccountEmailChangeLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Adapter
@Repository
@RequiredArgsConstructor
public class AccountEmailChangeLogAdapter implements AccountEmailChangeLogPort {

    private final AccountEmailChangeLogRepository repository;

    @Override
    public Optional<AccountEmailChangeLogMd> getLatestEmailChangeLog(UUID accountId) {
        return repository.findTopByAccountIdOrderByChangedAtDesc(accountId)
                .map(AccountEmailChangeLogEntity::toMd);
    }
}
