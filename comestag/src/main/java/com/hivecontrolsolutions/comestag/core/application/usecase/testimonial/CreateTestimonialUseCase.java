package com.hivecontrolsolutions.comestag.core.application.usecase.testimonial;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateTestimonialInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.TestimonialDm;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.TestimonialPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_NOT_EXIST;
import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TESTIMONIAL_VERIFY_CODE_INVALID;

@UseCase
@RequiredArgsConstructor
public class CreateTestimonialUseCase implements UsecaseWithoutOutput<CreateTestimonialInput> {

    private final AccountPort accountPort;
    private final TestimonialPort testimonialPort;
    private final EmailNotification emailNotification;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;

    @Transactional
    @Override
    public void execute(CreateTestimonialInput input) {

        var orgAccount = accountPort.getById(input.organizationId()).orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));
        if (!AccountType.ORG.equals(orgAccount.getType()))
            throw new BusinessException(ACCOUNT_NOT_EXIST);

        VerificationCodeDm verificationCodeDm = verificationCodePort.getByUserId(input.consumerId());

        var codeHashed = otpService.getCodeHash(input.code(), input.consumerId().toString());
        if (!verificationCodeDm.verify(codeHashed, Instant.now()))
            throw new BusinessException(TESTIMONIAL_VERIFY_CODE_INVALID);
        verificationCodePort.updateOrSave(verificationCodeDm);

        var testimonialDm = TestimonialDm.builder()
                .organizationId(input.organizationId())
                .consumerId(input.consumerId())
                .rating(input.rating())
                .consumerName(input.consumerName())
                .comment(input.comment())
                .build();
        testimonialPort.create(testimonialDm);

        emailNotification.sendTestimonialCreated(orgAccount.getDisplayName(), orgAccount.getEmail(), input.consumerName(), input.rating(), input.comment());
    }
}