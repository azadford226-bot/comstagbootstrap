package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.CapabilityDm;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface CapabilityPort {

    CapabilityDm getById(UUID id);

    CapabilityDm getByOrgIdAndId(UUID orgId, UUID id);

    CapabilityDm create(UUID orgAccountId,
                        String title,
                        String body);

    int update(UUID capabilityId,
               String title,
               String body);

    void delete(UUID capabilityId, UUID orgAccountId);

    Page<CapabilityDm> pageByOrganization(UUID orgId, int page, int size);
}
