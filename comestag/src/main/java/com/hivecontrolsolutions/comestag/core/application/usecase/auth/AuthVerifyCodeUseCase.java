package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AuthVerifyOtpInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.core.domain.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.VERIFY_CODE_INVALID;

@UseCase
@RequiredArgsConstructor
public class AuthVerifyCodeUseCase implements Usecase<AuthVerifyOtpInput, Map<String, String>> {

    private final AccountPort accountPort;
    private final VerificationCodePort verificationCodePort;
    private final JwtService jwt;
    private final OtpService otpService;

    @Transactional
    @Override
    public Map<String, String> execute(AuthVerifyOtpInput authOtpInput) {
        var accountDm = accountPort.getById(authOtpInput.userId())
                .orElseThrow(() -> new BusinessException(VERIFY_CODE_INVALID));
        VerificationCodeDm verificationCodeDm = verificationCodePort.getByUserId(authOtpInput.userId());

            var codeHashed = otpService.getCodeHash(authOtpInput.code(), authOtpInput.userId().toString());
            if (!verificationCodeDm.verify(codeHashed, Instant.now()))
                throw new BusinessException(VERIFY_CODE_INVALID);
            verificationCodePort.updateOrSave(verificationCodeDm);

            return jwt.issueTokens(accountDm);
    }

}
