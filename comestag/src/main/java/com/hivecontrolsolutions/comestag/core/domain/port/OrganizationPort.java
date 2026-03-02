package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateOrgProfileInput;
import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import org.springframework.data.domain.Page;

import java.util.Optional;
import java.util.UUID;

public interface OrganizationPort {
    OrganizationDm save(OrganizationDm org);

    Optional<OrganizationDm> getById(UUID id);
    void updateProfileImage(UUID accountId, UUID mediaId);
    void updateProfileCover(UUID accountId, UUID mediaId);

    OrganizationDm update(UpdateOrgProfileInput input);

    void increaseViewCount(UUID orgId);
    
    Page<OrganizationDm> findAll(int page, int size);
    
    Page<OrganizationDm> findPending(int page, int size);
    
    long countPending();
    
    void approve(UUID orgId);
}

