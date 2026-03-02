package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.RetryVerificationInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.core.domain.service.OrgEmailGuard;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import lombok.RequiredArgsConstructor;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.*;
import static com.hivecontrolsolutions.comestag.core.application.entity.input.RetryVerificationInput.VerificationType.CODE;
import static com.hivecontrolsolutions.comestag.core.application.entity.input.RetryVerificationInput.VerificationType.EMAIL;

@UseCase
@RequiredArgsConstructor
public class AuthRetryVerificationUseCase implements Usecase<RetryVerificationInput, UUID> {
    private final AccountPort accountPort;
    private final OrgEmailGuard orgEmailGuard;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;
    private final EmailNotification emailNotification;

    @Override
    public UUID execute(RetryVerificationInput in) {
        Optional<AccountDm> account;
        if (in.email() != null) {
            validateOrgEmail(in.email());
            account = accountPort.getByEmail(in.email());
        } else if (in.identifier() != null) {
            account = accountPort.getById(UUID.fromString(in.identifier()));
        } else {
            throw new BusinessException(INTERNAL_BAD_REQUEST, "Invalid email or identifier input");
        }

        var accountDm = account.orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));

        if (in.verificationType() == EMAIL && !accountDm.getEmailVerified()) {
            String code = generateVerificationCode(accountDm.getId());
            emailNotification.sendVerificationMail(accountDm.getDisplayName(), accountDm.getEmail(), accountDm.getId() + "_" + code);
        } else if (in.verificationType() == CODE && accountDm.getEmailVerified()) {
            String code = generateVerificationCode(accountDm.getId());
            emailNotification.sendVerificationCode(accountDm.getDisplayName(), accountDm.getEmail(), code);
            return accountDm.getId();
        }

        return null;
    }

    private void validateOrgEmail(String email) {
        orgEmailGuard.isIndividualEmail(email);
        orgEmailGuard.hasMxRecords(email);
    }

    private String generateVerificationCode(UUID userId) {
        Instant now = Instant.now();
        VerificationCodeDm verificationCodeDm = verificationCodePort.getByUserId(userId);

        if (verificationCodeDm.isLocked(now))
            throw new BusinessException(VERIFY_CODE_LOCKED);

        var newCode = otpService.generateCode();

        var isRenewed = verificationCodeDm.codeRenew(otpService.getCodeHash(newCode, userId.toString()), now);
        if (!isRenewed)
            throw new BusinessException(VERIFY_CODE_LOCKED);

        verificationCodePort.updateOrSave(verificationCodeDm);
        return newCode;

    }

}
