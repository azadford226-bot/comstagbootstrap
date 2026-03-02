package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AwardRfqInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.rfq.AwardRfqUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.AwardRfqRequest;
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
@RequestMapping("/v1/rfq/award")
public class AwardRfqProcessor {
    
    private final AwardRfqUseCase useCase;
    
    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping
    @Operation(summary = "Award RFQ",
            description = "Award an RFQ to a specific organization. Only the RFQ owner can award.")
    public ResponseEntity<?> awardRfq(@CurrentUserId UUID currentUserId,
                                      @Valid @RequestBody AwardRfqRequest request) {
        useCase.execute(AwardRfqInput.builder()
                .rfqId(request.rfqId())
                .ownerOrganizationId(currentUserId)
                .awardedToOrganizationId(request.awardedToOrganizationId())
                .build());
        return ResponseEntity.ok().build();
    }
}


