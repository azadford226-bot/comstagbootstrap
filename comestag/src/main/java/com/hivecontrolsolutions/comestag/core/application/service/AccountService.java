package com.hivecontrolsolutions.comestag.core.application.service;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.*;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountPort accountPort;
    private final PasswordEncoder encoder;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;

    public AccountDm getValidAccount(String email) {
        var accDm = accountPort.getByEmail(email).orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));
        verifyAccountStatus(accDm);
        return accDm;
    }

    public void updatePasswordByCode(String email, String newPassword, String verificationCode) {
        var accountDm = getValidAccount(email);

        VerificationCodeDm verificationCodeDm = verificationCodePort.getByUserId(accountDm.getId());
        var codeHashed = otpService.getCodeHash(verificationCode, accountDm.getId().toString());
        if (!verificationCodeDm.verify(codeHashed, Instant.now()))
            throw new BusinessException(VERIFY_CODE_INVALID);
        verificationCodePort.updateOrSave(verificationCodeDm);

        var newPasswordHash = encoder.encode(newPassword);
        accountPort.updatePassword(accountDm.getId(), newPasswordHash);
    }

    public void updatePasswordByOldPass(String email, String oldPassword, String newPassword) {
        var accountDm = getValidAccount(email);
        if (!encoder.matches(oldPassword, accountDm.getPasswordHash()))
            throw new BusinessException(PASSWORD_INVALID);
        var newPasswordHash = encoder.encode(newPassword);
        accountPort.updatePassword(accountDm.getId(), newPasswordHash);
    }

    private void verifyAccountStatus(AccountDm accountDm) {
        if (!accountDm.getEmailVerified())
            throw new BusinessException(ACCOUNT_EMAIL_NOT_VERIFIED);
        else if (accountDm.isLocked())
            throw new BusinessException(ACCOUNT_LOCKED);
    }
}
