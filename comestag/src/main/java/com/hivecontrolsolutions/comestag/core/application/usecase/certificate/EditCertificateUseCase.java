package com.hivecontrolsolutions.comestag.core.application.usecase.certificate;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateCertificateInput;
import com.hivecontrolsolutions.comestag.core.domain.model.CertificateDm;
import com.hivecontrolsolutions.comestag.core.domain.port.CertificatePort;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class EditCertificateUseCase implements UsecaseWithoutOutput<UpdateCertificateInput> {

    private final CertificatePort certificatePort;
    private final MediaPort mediaPort;

    @Transactional
    @Override
    public void execute(UpdateCertificateInput input) {
        // Ensure org owns this certificate
        CertificateDm certificate = certificatePort.getByOrgIdAndId(
                input.orgId(), input.certificateId()
        );

        UUID newImageId = input.newImageId();
        if (newImageId != null) {
            // validate new image belongs to org
            mediaPort.getByIdAndOwnerAccountId(newImageId, input.orgId());
        }

        certificatePort.update(
                certificate.getId(),
                input.title() == null ? certificate.getTitle() : input.title(),
                input.body() == null ? certificate.getBody() : input.body(),
                input.link() == null ? certificate.getLink() : input.link(),
                input.certificateDate() == null ? certificate.getCertificateDate() : input.certificateDate(),
                newImageId  // null => keep current
        );
    }
}