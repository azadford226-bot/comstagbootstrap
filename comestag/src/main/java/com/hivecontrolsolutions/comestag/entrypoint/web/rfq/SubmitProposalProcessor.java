package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.SubmitProposalInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.rfq.SubmitProposalUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.SubmitProposalRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/rfq/proposal")
public class SubmitProposalProcessor {
    
    private final SubmitProposalUseCase useCase;
    
    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping
    @Operation(summary = "Submit proposal",
            description = "Submit a proposal for an RFQ. Organization must be authenticated and active.")
    public ResponseEntity<?> submitProposal(@CurrentUserId UUID currentUserId,
                                            @Valid @RequestBody SubmitProposalRequest request) {
        useCase.execute(SubmitProposalInput.builder()
                .rfqId(request.rfqId())
                .organizationId(currentUserId)
                .proposalText(request.proposalText())
                .price(request.price())
                .currency(request.currency())
                .deliveryTime(request.deliveryTime())
                .build());
        return ResponseEntity.status(CREATED).build();
    }
}


