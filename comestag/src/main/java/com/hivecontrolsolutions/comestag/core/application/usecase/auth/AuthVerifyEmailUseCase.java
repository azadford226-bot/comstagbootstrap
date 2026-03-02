package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AuthVerifyOtpInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.*;

@UseCase
@RequiredArgsConstructor
public class AuthVerifyEmailUseCase implements Usecase<AuthVerifyOtpInput, Void> {

    private final AccountPort accountPort;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;

    @Transactional
    @Override
    public Void execute(AuthVerifyOtpInput authOtpInput) {
        var accountDm = accountPort.getById(authOtpInput.userId())
                .orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));
        if (accountDm.getEmailVerified())
            throw new BusinessException(ACCOUNT_EMAIL_ALREADY_VERIFIED);
        VerificationCodeDm verificationCodeDm = verificationCodePort.getByUserId(authOtpInput.userId());

        var codeHashed = otpService.getCodeHash(authOtpInput.code(), authOtpInput.userId().toString());

        if (!verificationCodeDm.verify(codeHashed, Instant.now()))
            throw new BusinessException(VERIFY_CODE_INVALID);
        verificationCodePort.updateOrSave(verificationCodeDm);

        if (!accountDm.getEmailVerified()) {
            accountPort.verifyEmail(accountDm.getId());
        }
        return null;
    }

}
