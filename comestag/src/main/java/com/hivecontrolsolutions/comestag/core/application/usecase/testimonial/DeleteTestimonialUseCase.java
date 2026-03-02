package com.hivecontrolsolutions.comestag.core.application.usecase.testimonial;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.DeleteTestimonialInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.port.TestimonialPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TESTIMONIAL_NOT_EXIST;
import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TESTIMONIAL_VERIFY_CODE_INVALID;

@UseCase
@RequiredArgsConstructor
public class DeleteTestimonialUseCase implements UsecaseWithoutOutput<DeleteTestimonialInput> {

    private final TestimonialPort testimonialPort;
    private final VerificationCodePort verificationCodePort;
    private final OtpService otpService;

    @Transactional
    @Override
    public void execute(DeleteTestimonialInput input) {
        var testimonialDm = testimonialPort.getById(input.testimonialId());
        if (!testimonialDm.getConsumerId().equals(input.consumerId()))
            throw new BusinessException(TESTIMONIAL_NOT_EXIST);

        VerificationCodeDm verificationCodeDm = verificationCodePort.getByUserId(input.consumerId());

        var codeHashed = otpService.getCodeHash(input.code(), input.consumerId().toString());
        if (!verificationCodeDm.verify(codeHashed, Instant.now()))
            throw new BusinessException(TESTIMONIAL_VERIFY_CODE_INVALID);
        verificationCodePort.updateOrSave(verificationCodeDm);

        testimonialPort.delete(input.testimonialId());

    }
}
