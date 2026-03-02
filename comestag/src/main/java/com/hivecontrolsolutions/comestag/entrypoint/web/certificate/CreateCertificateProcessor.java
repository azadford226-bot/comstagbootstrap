package com.hivecontrolsolutions.comestag.entrypoint.web.certificate;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateCertificateInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.certificate.CreateCertificateUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.certificate.CertificateRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/certificate")
public class CreateCertificateProcessor {

    private final CreateCertificateUseCase useCase;

    @PreAuthorize("(hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))")
    @PostMapping
    @Operation(summary = "Create certificate",
            description = """
                    Use this endpoint to allow organizations to create there certificates.
                    If the certificate have image id, the image will be uploaded to the storage first by upload certificate endpoint.
                    """
    )
    public ResponseEntity<?> createCertificate(@CurrentUserId UUID currentUserId,
                                               @Valid @RequestBody CertificateRequest request) {
        useCase.execute(toInput(currentUserId, request));
        return ResponseEntity.ok().build();
    }

    private CreateCertificateInput toInput(UUID orgId, CertificateRequest request) {
        return new CreateCertificateInput(
                orgId,
                request.imageId(),
                request.title(),
                request.body(),
                request.link(),
                request.certificateDate()
        );
    }
}