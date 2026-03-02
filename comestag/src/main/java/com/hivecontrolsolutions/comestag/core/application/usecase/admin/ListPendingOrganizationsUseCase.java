package com.hivecontrolsolutions.comestag.core.application.usecase.admin;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

@UseCase
@RequiredArgsConstructor
public class ListPendingOrganizationsUseCase implements Usecase<Integer, Page<OrganizationDm>> {
    
    private final OrganizationPort organizationPort;
    
    @Override
    public Page<OrganizationDm> execute(Integer page) {
        return organizationPort.findPending(page, 20);
    }
}
