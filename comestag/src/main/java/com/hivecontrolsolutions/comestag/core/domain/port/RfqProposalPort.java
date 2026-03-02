package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.RfqProposalDm;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RfqProposalPort {
    
    RfqProposalDm getById(UUID id);
    
    Optional<RfqProposalDm> getByRfqIdAndOrganizationId(UUID rfqId, UUID organizationId);
    
    RfqProposalDm create(UUID rfqId,
                        UUID organizationId,
                        String proposalText,
                        java.math.BigDecimal price,
                        String currency,
                        String deliveryTime);
    
    List<RfqProposalDm> getByRfqId(UUID rfqId);
    
    Page<RfqProposalDm> pageByRfqId(UUID rfqId, int page, int size);
    
    Page<RfqProposalDm> pageByOrganizationId(UUID organizationId, int page, int size);
    
    void updateStatus(UUID proposalId, RfqProposalDm.ProposalStatus status);
    
    long countByRfqId(UUID rfqId);
    
    long countByRfqIdAndStatus(UUID rfqId, RfqProposalDm.ProposalStatus status);
}


