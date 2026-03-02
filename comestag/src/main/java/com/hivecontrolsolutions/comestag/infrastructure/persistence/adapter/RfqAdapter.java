package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqInvitedOrganizationEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RfqInvitedOrganizationRepository;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RfqRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.SUCCESS_STORY_NOT_EXIST;

@Adapter
@RequiredArgsConstructor
public class RfqAdapter implements RfqPort {
    
    private final RfqRepository repo;
    private final RfqInvitedOrganizationRepository invitedOrgRepo;
    
    @Override
    @Transactional(readOnly = true)
    public RfqDm getById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST))
                .toDm();
    }
    
    @Override
    @Transactional
    public RfqDm create(UUID organizationId,
                       String title,
                       String description,
                       String category,
                       Long industryId,
                       BigDecimal budget,
                       String budgetCurrency,
                       Instant deadline,
                       String requirements,
                       RfqDm.RfqVisibility visibility) {
        var entity = RfqEntity.builder()
                .organizationId(organizationId)
                .title(title)
                .description(description)
                .category(category)
                .industryId(industryId)
                .budget(budget)
                .budgetCurrency(budgetCurrency != null ? budgetCurrency : "USD")
                .deadline(deadline)
                .requirements(requirements)
                .visibility(RfqEntity.RfqVisibility.valueOf(visibility.name()))
                .status(RfqEntity.RfqStatus.OPEN)
                .build();
        return repo.save(entity).toDm();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<RfqDm> pageByOrganizationId(UUID organizationId, int page, int size) {
        return repo.findByOrganizationId(organizationId, PageRequest.of(page, size))
                .map(RfqEntity::toDm);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<RfqDm> pageAvailable(UUID organizationId, int page, int size) {
        return repo.findAvailableRfqs(organizationId, PageRequest.of(page, size))
                .map(RfqEntity::toDm);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<RfqDm> pageByStatus(RfqDm.RfqStatus status, int page, int size) {
        return repo.findByStatus(RfqEntity.RfqStatus.valueOf(status.name()), PageRequest.of(page, size))
                .map(RfqEntity::toDm);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<RfqDm> pageByIndustryId(Long industryId, int page, int size) {
        return repo.findByIndustryId(industryId, PageRequest.of(page, size))
                .map(RfqEntity::toDm);
    }
    
    @Override
    @Transactional
    public void updateStatus(UUID rfqId, RfqDm.RfqStatus status) {
        var entity = repo.findById(rfqId)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST));
        entity.setStatus(RfqEntity.RfqStatus.valueOf(status.name()));
        repo.save(entity);
    }
    
    @Override
    @Transactional
    public void awardTo(UUID rfqId, UUID organizationId) {
        var entity = repo.findById(rfqId)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST));
        entity.setAwardedToId(organizationId);
        entity.setStatus(RfqEntity.RfqStatus.AWARDED);
        repo.save(entity);
    }
    
    @Override
    @Transactional
    public void inviteOrganizations(UUID rfqId, List<UUID> organizationIds) {
        // Delete existing invitations for this RFQ
        invitedOrgRepo.deleteByRfqId(rfqId);
        
        // Create new invitations
        if (organizationIds != null && !organizationIds.isEmpty()) {
            var invitations = organizationIds.stream()
                    .map(orgId -> RfqInvitedOrganizationEntity.builder()
                            .rfqId(rfqId)
                            .organizationId(orgId)
                            .build())
                    .collect(Collectors.toList());
            invitedOrgRepo.saveAll(invitations);
        }
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UUID> getInvitedOrganizationIds(UUID rfqId) {
        return invitedOrgRepo.findByRfqId(rfqId)
                .stream()
                .map(RfqInvitedOrganizationEntity::getOrganizationId)
                .collect(Collectors.toList());
    }
}

