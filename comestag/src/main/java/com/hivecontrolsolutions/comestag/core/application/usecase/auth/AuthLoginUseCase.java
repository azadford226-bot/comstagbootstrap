package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AuthLoginInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import com.hivecontrolsolutions.comestag.core.domain.service.JwtService;
import com.hivecontrolsolutions.comestag.core.domain.service.OrgEmailGuard;
import com.hivecontrolsolutions.comestag.entrypoint.entity.auth.AuthLoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.*;
import static com.hivecontrolsolutions.comestag.core.constant.SecurityConstant.ACCESS_TOKEN;
import static com.hivecontrolsolutions.comestag.core.constant.SecurityConstant.REFRESH_TOKEN;

@UseCase
@RequiredArgsConstructor
@Slf4j
public class AuthLoginUseCase implements Usecase<AuthLoginInput, AuthLoginResponse> {

    private final AccountPort accountPort;
    private final PasswordEncoder encoder;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;
    private final EmailNotification emailNotification;
    private final OrgEmailGuard orgEmailGuard;
    private final JwtService jwtService;

    @Transactional
    @Override
    public AuthLoginResponse execute(AuthLoginInput in) {
        var acc = accountPort.getByEmail(in.email());
        if (acc.isEmpty() || !encoder.matches(in.password(), acc.get().getPasswordHash()))
            throw new BusinessException(INVALID_CREDENTIALS);

        var accDm = acc.get();
        
        // Skip email validation and verification code for ADMIN accounts
        if (accDm.getType() != com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.ADMIN) {
            validateOrgEmail(in.email());
            verifyAccountStatus(accDm);
            String code = generateVerificationCode(accDm.getId());
            emailNotification.sendVerificationCode(accDm.getDisplayName(), in.email(),  code);
            // Return userId for regular users (they need to verify code)
            return AuthLoginResponse.forRegularUser(accDm.getId());
        } else {
            // For ADMIN accounts, only verify status (no email verification needed)
            if (accDm.isLocked()) {
                throw new BusinessException(ACCOUNT_LOCKED);
            }
            // Generate and return tokens directly for ADMIN accounts
            Map<String, String> tokens = jwtService.issueTokens(accDm);
            return AuthLoginResponse.forAdmin(tokens.get(ACCESS_TOKEN), tokens.get(REFRESH_TOKEN));
        }
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

    private void validateOrgEmail(String email) {
        orgEmailGuard.isIndividualEmail(email);
        orgEmailGuard.hasMxRecords(email);
    }

    private void verifyAccountStatus(AccountDm accountDm) {
        if (!accountDm.getEmailVerified())
            throw new BusinessException(ACCOUNT_EMAIL_NOT_VERIFIED);
        else if (accountDm.isLocked())
            throw new BusinessException(ACCOUNT_LOCKED);
    }
}

