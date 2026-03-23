package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqProposalPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.RfqProposalResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.RFQ_ACCESS_DENIED;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/rfq")
public class ListRfqProposalsProcessor {

    private final RfqPort rfqPort;
    private final RfqProposalPort proposalPort;

    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{rfqId}/proposals")
    @Operation(summary = "List proposals for an RFQ",
            description = "List proposals submitted for an RFQ. Only the RFQ owner can view proposals.")
    public ResponseEntity<Page<RfqProposalResponse>> listProposals(
            @CurrentUserId UUID currentUserId,
            @PathVariable UUID rfqId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        var rfq = rfqPort.getById(rfqId);

        if (!rfq.getOrganizationId().equals(currentUserId)) {
            throw new BusinessException(RFQ_ACCESS_DENIED, "Only the RFQ owner can view proposals");
        }

        var result = proposalPort.pageByRfqId(rfqId, page, size)
                .map(RfqProposalResponse::from);

        return ResponseEntity.ok(result);
    }
}
