package com.hivecontrolsolutions.comestag.core.application.usecase.profile;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateEmailInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountEmailChangeLogPort;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import com.hivecontrolsolutions.comestag.core.domain.service.OrgEmailGuard;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.*;

@UseCase
@RequiredArgsConstructor
public class UpdateProfileEmailUseCase implements UsecaseWithoutOutput<UpdateEmailInput> {
    private final AccountPort accountPort;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;
    private final EmailNotification emailNotification;
    private final AccountEmailChangeLogPort accountEmailChangeLogPort;
    private final OrgEmailGuard orgEmailGuard;

    @Transactional
    @Override
    public void execute(UpdateEmailInput input) {
        validateOrgEmail(input.newEmail());
        var accountDm = accountPort.getById(input.userId())
                .orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));
        if (accountDm.getEmail().equals(input.newEmail()))
            throw new BusinessException(ACCOUNT_EMAIL_SAME);
        else if (!accountDm.getEmailVerified())
            throw new BusinessException(ACCOUNT_EMAIL_NOT_VERIFIED);


        accountPort.updateEmail(accountDm.getId(), input.newEmail());

        String code = generateVerificationCode(accountDm.getId());

        accountEmailChangeLogPort.getLatestEmailChangeLog(accountDm.getId()).ifPresent(log -> {
            var verifyEmailIdentifier = accountDm.getId() + "_" + code;
            var restoreEmailIdentifier = log.getAccountId() + "_" + log.getId();
            emailNotification.sendVerificationMail(accountDm.getDisplayName(), input.newEmail(), verifyEmailIdentifier);
            emailNotification.sendChangeEmailAlert(accountDm.getDisplayName(), accountDm.getEmail(), input.newEmail(), restoreEmailIdentifier);
        });

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
