package com.hivecontrolsolutions.comestag.entrypoint.web.certificate;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateCertificateInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.certificate.EditCertificateUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.certificate.UpdateCertificateRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/certificate")
public class UpdateCertificateProcessor {

    private final EditCertificateUseCase useCase;

    @PreAuthorize("hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING'))")
    @PutMapping("/{certificateId}")
    @Operation(summary = "Update certificate",
            description = """
                    Use this endpoint to allow organizations to create there certificates.
                    If the certificate have image id, the image will be uploaded to the storage first by upload certificate endpoint.
                    """
    )
    public ResponseEntity<?> editCertificate(@CurrentUserId UUID currentUserId,
                                             @PathVariable UUID certificateId,
                                             @Valid @RequestBody UpdateCertificateRequest request) {
        useCase.execute(toInput(currentUserId, certificateId, request));
        return ResponseEntity.ok().build();
    }

    private UpdateCertificateInput toInput(UUID orgId,
                                           UUID certificateId,
                                           UpdateCertificateRequest request) {
        return new UpdateCertificateInput(
                orgId,
                certificateId,
                request.title(),
                request.body(),
                request.link(),
                request.certificateDate(),
                request.newImageId()
        );
    }
}