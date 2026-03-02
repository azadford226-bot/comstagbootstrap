package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface RfqPort {
    
    RfqDm getById(UUID id);
    
    RfqDm create(UUID organizationId,
                 String title,
                 String description,
                 String category,
                 Long industryId,
                 java.math.BigDecimal budget,
                 String budgetCurrency,
                 java.time.Instant deadline,
                 String requirements,
                 RfqDm.RfqVisibility visibility);
    
    Page<RfqDm> pageByOrganizationId(UUID organizationId, int page, int size);
    
    Page<RfqDm> pageAvailable(UUID organizationId, int page, int size);
    
    Page<RfqDm> pageByStatus(RfqDm.RfqStatus status, int page, int size);
    
    Page<RfqDm> pageByIndustryId(Long industryId, int page, int size);
    
    void updateStatus(UUID rfqId, RfqDm.RfqStatus status);
    
    void awardTo(UUID rfqId, UUID organizationId);
    
    void inviteOrganizations(UUID rfqId, List<UUID> organizationIds);
    
    List<UUID> getInvitedOrganizationIds(UUID rfqId);
}


