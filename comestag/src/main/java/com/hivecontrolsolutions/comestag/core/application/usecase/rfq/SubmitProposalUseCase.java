package com.hivecontrolsolutions.comestag.core.application.usecase.rfq;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.SubmitProposalInput;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqProposalPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.*;

@UseCase
@RequiredArgsConstructor
public class SubmitProposalUseCase implements UsecaseWithoutOutput<SubmitProposalInput> {
    
    private final RfqPort rfqPort;
    private final RfqProposalPort proposalPort;
    
    @Transactional
    @Override
    public void execute(SubmitProposalInput input) {
        // Verify RFQ exists and is OPEN
        var rfq = rfqPort.getById(input.rfqId());
        
        if (rfq.getStatus() != RfqDm.RfqStatus.OPEN) {
            throw new BusinessException(RFQ_NOT_OPEN, "This RFQ is not open for proposals. Current status: " + rfq.getStatus());
        }
        
        // Check if proposal already exists
        var existingProposal = proposalPort.getByRfqIdAndOrganizationId(input.rfqId(), input.organizationId());
        if (existingProposal.isPresent()) {
            throw new BusinessException(PROPOSAL_ALREADY_EXISTS, "You have already submitted a proposal for this RFQ");
        }
        
        // Verify organization is allowed to submit (PUBLIC, INVITE_ONLY, or owner)
        boolean isOwner = rfq.getOrganizationId().equals(input.organizationId());
        boolean isPublic = rfq.getVisibility() == RfqDm.RfqVisibility.PUBLIC;
        boolean isInvited = rfqPort.getInvitedOrganizationIds(input.rfqId()).contains(input.organizationId());
        
        if (!isOwner && !isPublic && !isInvited) {
            throw new BusinessException(PROPOSAL_NOT_ALLOWED, "You are not allowed to submit a proposal for this RFQ. It may be private or you may not be invited");
        }
        
        // Create proposal
        proposalPort.create(
                input.rfqId(),
                input.organizationId(),
                input.proposalText(),
                input.price(),
                input.currency(),
                input.deliveryTime()
        );
    }
}


