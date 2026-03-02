package com.hivecontrolsolutions.comestag.entrypoint.web.certificate;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.port.CertificatePort;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/certificate")
public class DeleteCertificateProcessor {

    private final CertificatePort certificatePort;

    @PreAuthorize("hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING'))")
    @DeleteMapping("/{certificateId}")
    @Operation(summary = "Delete certificate", description = "Use this endpoint to allow organizations to delete there certificates")
    public ResponseEntity<?> deleteCertificate(@CurrentUserId UUID currentUserId,
                                               @PathVariable UUID certificateId) {
        certificatePort.delete(certificateId, currentUserId);
        return ResponseEntity.ok().build();
    }
}