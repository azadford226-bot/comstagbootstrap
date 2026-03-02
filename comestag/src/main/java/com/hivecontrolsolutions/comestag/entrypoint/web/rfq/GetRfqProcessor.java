package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqProposalPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.RfqResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.RFQ_ACCESS_DENIED;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/rfq")
public class GetRfqProcessor {
    
    private final RfqPort rfqPort;
    private final RfqProposalPort proposalPort;
    
    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{id}")
    @Operation(summary = "Get RFQ by ID",
            description = "Get a single RFQ by ID. User must have access to the RFQ.")
    public ResponseEntity<RfqResponse> getRfq(@CurrentUserId UUID currentUserId,
                                               @PathVariable UUID id) {
        var rfq = rfqPort.getById(id);
        
        // Check visibility
        boolean isOwner = rfq.getOrganizationId().equals(currentUserId);
        boolean isPublic = rfq.getVisibility() == RfqDm.RfqVisibility.PUBLIC;
        boolean isInvited = rfqPort.getInvitedOrganizationIds(id).contains(currentUserId);
        
        if (!isOwner && !isPublic && !isInvited) {
            throw new BusinessException(RFQ_ACCESS_DENIED, "You do not have access to this RFQ");
        }
        
        long proposalCount = proposalPort.countByRfqId(id);
        boolean hasSubmitted = proposalPort.getByRfqIdAndOrganizationId(id, currentUserId).isPresent();
        
        var response = RfqResponse.from(rfq, proposalCount, hasSubmitted, isOwner);
        return ResponseEntity.ok(response);
    }
}


