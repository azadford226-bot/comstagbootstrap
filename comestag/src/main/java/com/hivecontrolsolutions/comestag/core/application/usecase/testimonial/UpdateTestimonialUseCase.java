package com.hivecontrolsolutions.comestag.core.application.usecase.testimonial;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateTestimonialInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.TestimonialPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TESTIMONIAL_VERIFY_CODE_INVALID;
import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TESTIMONIAL_WRONG_CONSUMER;

@UseCase
@RequiredArgsConstructor
public class UpdateTestimonialUseCase implements UsecaseWithoutOutput<UpdateTestimonialInput> {

    private final TestimonialPort testimonialPort;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;

    @Transactional
    @Override
    public void execute(UpdateTestimonialInput input) {
        var testimonialDm = testimonialPort.getById(input.testimonialId());
        if (!testimonialDm.getConsumerId().equals(input.consumerId()))
            throw new BusinessException(TESTIMONIAL_WRONG_CONSUMER);

        VerificationCodeDm verificationCodeDm = verificationCodePort.getByUserId(input.consumerId());

        var codeHashed = otpService.getCodeHash(input.code(), input.consumerId().toString());
        if (!verificationCodeDm.verify(codeHashed, Instant.now()))
            throw new BusinessException(TESTIMONIAL_VERIFY_CODE_INVALID);
        verificationCodePort.updateOrSave(verificationCodeDm);

        testimonialPort.update(input.testimonialId(), input.rating(), input.comment());

    }
}
