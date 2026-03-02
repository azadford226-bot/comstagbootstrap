package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqProposalDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqProposalPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqProposalEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RfqProposalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.SUCCESS_STORY_NOT_EXIST;

@Adapter
@RequiredArgsConstructor
public class RfqProposalAdapter implements RfqProposalPort {
    
    private final RfqProposalRepository repo;
    
    @Override
    @Transactional(readOnly = true)
    public RfqProposalDm getById(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST))
                .toDm();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<RfqProposalDm> getByRfqIdAndOrganizationId(UUID rfqId, UUID organizationId) {
        return repo.findByRfqIdAndOrganizationId(rfqId, organizationId)
                .map(RfqProposalEntity::toDm);
    }
    
    @Override
    @Transactional
    public RfqProposalDm create(UUID rfqId,
                               UUID organizationId,
                               String proposalText,
                               BigDecimal price,
                               String currency,
                               String deliveryTime) {
        var entity = RfqProposalEntity.builder()
                .rfqId(rfqId)
                .organizationId(organizationId)
                .proposalText(proposalText)
                .price(price)
                .currency(currency != null ? currency : "USD")
                .deliveryTime(deliveryTime)
                .status(RfqProposalEntity.ProposalStatus.SUBMITTED)
                .build();
        return repo.save(entity).toDm();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<RfqProposalDm> getByRfqId(UUID rfqId) {
        return repo.findByRfqId(rfqId)
                .stream()
                .map(RfqProposalEntity::toDm)
                .toList();
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<RfqProposalDm> pageByRfqId(UUID rfqId, int page, int size) {
        return repo.findByRfqId(rfqId, PageRequest.of(page, size))
                .map(RfqProposalEntity::toDm);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<RfqProposalDm> pageByOrganizationId(UUID organizationId, int page, int size) {
        return repo.findByOrganizationId(organizationId, PageRequest.of(page, size))
                .map(RfqProposalEntity::toDm);
    }
    
    @Override
    @Transactional
    public void updateStatus(UUID proposalId, RfqProposalDm.ProposalStatus status) {
        var entity = repo.findById(proposalId)
                .orElseThrow(() -> new BusinessException(SUCCESS_STORY_NOT_EXIST));
        entity.setStatus(RfqProposalEntity.ProposalStatus.valueOf(status.name()));
        repo.save(entity);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByRfqId(UUID rfqId) {
        return repo.countByRfqId(rfqId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByRfqIdAndStatus(UUID rfqId, RfqProposalDm.ProposalStatus status) {
        return repo.countByRfqIdAndStatus(rfqId, RfqProposalEntity.ProposalStatus.valueOf(status.name()));
    }
}

