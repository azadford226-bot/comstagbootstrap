package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ListRfqsInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.rfq.ListRfqsUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqProposalPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.RfqResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/rfq")
public class ListRfqsProcessor {
    
    private final ListRfqsUseCase useCase;
    private final RfqProposalPort proposalPort;
    
    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping
    @Operation(summary = "List RFQs",
            description = "List RFQs based on filter. Filter can be 'mine', 'available', or 'all'.")
    public ResponseEntity<Page<RfqResponse>> listRfqs(
            @CurrentUserId UUID currentUserId,
            @RequestParam(defaultValue = "all") String filter,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long industryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        var input = new ListRfqsInput(
                currentUserId,
                filter,
                status != null ? RfqDm.RfqStatus.valueOf(status) : null,
                industryId,
                page,
                size
        );
        
        var result = useCase.execute(input);
        
        // Map to response with additional info
        var response = result.map(rfq -> {
            long proposalCount = proposalPort.countByRfqId(rfq.getId());
            boolean hasSubmitted = proposalPort.getByRfqIdAndOrganizationId(rfq.getId(), currentUserId).isPresent();
            boolean isOwner = rfq.getOrganizationId().equals(currentUserId);
            return RfqResponse.from(rfq, proposalCount, hasSubmitted, isOwner);
        });
        
        return ResponseEntity.ok(response);
    }
}

