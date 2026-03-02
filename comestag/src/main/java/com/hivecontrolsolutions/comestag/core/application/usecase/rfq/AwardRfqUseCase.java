package com.hivecontrolsolutions.comestag.core.application.usecase.rfq;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AwardRfqInput;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqProposalDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqProposalPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.*;

@UseCase
@RequiredArgsConstructor
public class AwardRfqUseCase implements UsecaseWithoutOutput<AwardRfqInput> {
    
    private final RfqPort rfqPort;
    private final RfqProposalPort proposalPort;
    
    @Transactional
    @Override
    public void execute(AwardRfqInput input) {
        // Verify RFQ exists and is owned by the requesting organization
        var rfq = rfqPort.getById(input.rfqId());
        
        if (!rfq.getOrganizationId().equals(input.ownerOrganizationId())) {
            throw new BusinessException(RFQ_NOT_OWNER, "You are not the owner of this RFQ");
        }
        
        // Verify proposal exists
        var proposal = proposalPort.getByRfqIdAndOrganizationId(input.rfqId(), input.awardedToOrganizationId())
                .orElseThrow(() -> new BusinessException(PROPOSAL_NOT_FOUND, "Proposal not found for this RFQ"));
        
        // Update proposal status to ACCEPTED
        proposalPort.updateStatus(proposal.getId(), RfqProposalDm.ProposalStatus.ACCEPTED);
        
        // Reject all other proposals for this RFQ
        List<RfqProposalDm> allProposals = proposalPort.getByRfqId(input.rfqId());
        for (RfqProposalDm otherProposal : allProposals) {
            if (!otherProposal.getId().equals(proposal.getId()) 
                    && otherProposal.getStatus() == RfqProposalDm.ProposalStatus.SUBMITTED) {
                proposalPort.updateStatus(otherProposal.getId(), RfqProposalDm.ProposalStatus.REJECTED);
            }
        }
        
        // Award RFQ
        rfqPort.awardTo(input.rfqId(), input.awardedToOrganizationId());
        
        // Update RFQ status to AWARDED
        rfqPort.updateStatus(input.rfqId(), RfqDm.RfqStatus.AWARDED);
        
        // TODO: Create project automatically when project feature is implemented
        // This requires a Project domain model and ProjectPort to be created first
        // Project should link the awarded RFQ, owner organization, and awarded organization
    }
}


