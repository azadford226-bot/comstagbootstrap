package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateOrgProfileInput;
import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.IndustryEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OrganizationEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.OrganizationRepository;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_NOT_EXIST;
import static com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.OrganizationEntity.fromDm;

@RequiredArgsConstructor
@Adapter
public class OrganizationAdapter implements OrganizationPort {
    private final OrganizationRepository repo;

    @Override
    public OrganizationDm save(OrganizationDm organizationDm) {
        var e = fromDm(organizationDm);
        return repo.save(e).toDm();
    }

    @Override
    public Optional<OrganizationDm> getById(UUID id) {
        return repo.findById(id).map(OrganizationEntity::toDm);
    }

    @Override
    public void updateProfileImage(UUID accountId, UUID mediaId) {
        repo.updateProfileImage(accountId, mediaId);
    }

    @Override
    public void updateProfileCover(UUID accountId, UUID mediaId) {
        repo.updateProfileCover(accountId, mediaId);
    }

    @Override
    public OrganizationDm update(UpdateOrgProfileInput input) {
        OrganizationEntity entity = repo.findById(input.id())
                .orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));
        entity.setDisplayName(input.displayName());
        entity.setWebsite(input.website());
        entity.setIndustry(IndustryEntity.builder().id(input.industryId()).build());
        entity.setEstablished(input.established());
        entity.setSize(input.size());
        entity.setWhoWeAre(input.whoWeAre());
        entity.setWhatWeDo(input.whatWeDo());
        entity.setPhone(input.phone());
        entity.setCountry(input.country());
        entity.setState(input.state());
        entity.setCity(input.city());

        return repo.saveAndFlush(entity).toDm();
    }


    @Override
    public void increaseViewCount(UUID orgId) {
        repo.incrementViews(orgId);
    }
    
    @Override
    public org.springframework.data.domain.Page<OrganizationDm> findAll(int page, int size) {
        return repo.findAll(org.springframework.data.domain.PageRequest.of(page, size))
                .map(OrganizationEntity::toDm);
    }
    
    @Override
    public org.springframework.data.domain.Page<OrganizationDm> findPending(int page, int size) {
        return repo.findPending(org.springframework.data.domain.PageRequest.of(page, size))
                .map(OrganizationEntity::toDm);
    }
    
    @Override
    public long countPending() {
        return repo.countByApproved(false);
    }
    
    @Override
    public void approve(UUID orgId) {
        repo.approve(orgId);
    }
}
