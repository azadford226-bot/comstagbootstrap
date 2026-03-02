package com.hivecontrolsolutions.comestag.core.application.usecase.certificate;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateCertificateInput;
import com.hivecontrolsolutions.comestag.core.domain.port.CertificatePort;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class CreateCertificateUseCase implements UsecaseWithoutOutput<CreateCertificateInput> {

    private final CertificatePort certificatePort;
    private final MediaPort mediaPort;

    @Transactional
    @Override
    public void execute(CreateCertificateInput input) {
        // Validate media belongs to org; throws if not
        mediaPort.getByIdAndOwnerAccountId(input.imageId(), input.orgId());

        // You can add extra check here to ensure media type == IMAGE if you want.

        certificatePort.create(
                input.orgId(),
                input.imageId(),
                input.title(),
                input.body(),
                input.link(),
                input.certificateDate()
        );
    }
}