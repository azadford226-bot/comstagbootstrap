package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.RegisterInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.*;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.ConsumerPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import com.hivecontrolsolutions.comestag.core.domain.service.OrgEmailGuard;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_EXIST;
import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.VERIFY_CODE_LOCKED;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus.ACTIVE;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus.PENDING;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.CONSUMER;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.ORG;

@Slf4j
@UseCase
@RequiredArgsConstructor
public class AuthRegisterUseCase implements UsecaseWithoutOutput<RegisterInput> {

    private final AccountPort accountPort;
    private final OrganizationPort organizationPort;
    private final ConsumerPort consumerPort;
    private final OrgEmailGuard orgEmailGuard;
    private final PasswordEncoder encoder;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;
    private final EmailNotification emailNotification;

    @Transactional
    @Override
    public void execute(RegisterInput in) {
        validateOrgEmail(in.email());
        checkEmailsExist(in.email());
        var accountDm = addAccount(in);
        if (in.type() == ORG) {
            addOrgAccount(accountDm.getId(), in);
        } else if (in.type() == CONSUMER) {
            addConsAccount(accountDm.getId(), in);
        }

        String code = generateVerificationCode(accountDm.getId());
        emailNotification.sendVerificationMail(in.displayName(), in.email(), accountDm.getId() + "_" + code);

    }

    private void validateOrgEmail(String email) {
        orgEmailGuard.isIndividualEmail(email);
        orgEmailGuard.hasMxRecords(email);
    }

    private void checkEmailsExist(String email) {
        accountPort.getByEmail(email).ifPresent(a -> {
            throw new BusinessException(ACCOUNT_EXIST);
        });
    }

    private AccountDm addAccount(RegisterInput in) {
        var acc = AccountDm.builder()
                .displayName(in.displayName())
                .type(in.type())
                .email(in.email())
                .status(in.type() == ORG ? PENDING : ACTIVE)
                .passwordHash(encoder.encode(in.password()))
                .build();
        return accountPort.save(acc);
    }

    private void addOrgAccount(UUID accountId, RegisterInput in) {
        var org = OrganizationDm.builder()
                .id(accountId)
                .displayName(in.displayName())
                .industry(IndustryDm.builder().id(in.industryId()).build())
                .established(in.established())
                .website(in.website())
                .whoWeAre(in.whoWeAre())
                .whatWeDo(in.whatWeDo())
                .size(in.size())
                .country(in.country())
                .state(in.state())
                .city(in.city())
                .build();
        organizationPort.save(org);
    }

    private void addConsAccount(UUID uuid, RegisterInput in) {
        var cons = ConsumerDm.builder()
                .id(uuid)
                .displayName(in.displayName())
                .industry(IndustryDm.builder().id(in.industryId()).build())
                .size(in.size())
                .interests(in.interests().stream().map(String::valueOf).collect(Collectors.toSet()))
                .established(in.established())
                .website(in.website())
                .country(in.country())
                .state(in.state())
                .city(in.city())
                .build();
        consumerPort.save(cons);
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

