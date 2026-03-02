package com.hivecontrolsolutions.comestag.core.application.usecase.admin;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_NOT_EXIST;

@UseCase
@RequiredArgsConstructor
public class ApproveOrganizationUseCase implements UsecaseWithoutOutput<UUID> {
    
    private final OrganizationPort organizationPort;
    
    @Override
    public void execute(UUID orgId) {
        organizationPort.getById(orgId)
                .orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));
        
        organizationPort.approve(orgId);
    }
}
