package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountEmailChangeLogPort;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_EMAIL_CHANGE_LOG_NOT_FOUND;
import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_EMAIL_RESTORE_EXPIRED;

@UseCase
@RequiredArgsConstructor
public class AuthRestoreEmailUseCase implements UsecaseWithoutOutput<String> {
    private final AccountPort accountPort;
    private final AccountEmailChangeLogPort accountEmailChangeLogPort;
    @Value("${account.email.change-log.expiry}")
    private int emailChangeLogExpiry;

    @Transactional
    @Override
    public void execute(String identifier) {
        var identifierValues = identifier.split("_");
        if (identifierValues.length != 2)
            throw new BusinessException(ACCOUNT_EMAIL_CHANGE_LOG_NOT_FOUND);
        var accountId = UUID.fromString(identifierValues[0]);
        var restoreId = UUID.fromString(identifierValues[1]);

        var accountEmailChangeLogMd = accountEmailChangeLogPort.getLatestEmailChangeLog(accountId)
                .orElseThrow(() -> new BusinessException(ACCOUNT_EMAIL_CHANGE_LOG_NOT_FOUND));
        if (!accountEmailChangeLogMd.getId().equals(restoreId))
            throw new BusinessException(ACCOUNT_EMAIL_CHANGE_LOG_NOT_FOUND);
        else if (accountEmailChangeLogMd.isExpired(emailChangeLogExpiry)) {
            throw new BusinessException(ACCOUNT_EMAIL_RESTORE_EXPIRED);
        }
        accountPort.restoreEmail(accountId, accountEmailChangeLogMd.getOldEmail());
    }
}
