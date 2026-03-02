package com.hivecontrolsolutions.comestag.core.application.usecase.admin;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutInput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.ContactMessagePort;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.admin.AdminStatsResponse;
import lombok.RequiredArgsConstructor;

import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.ADMIN;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.CONSUMER;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.ORG;

@UseCase
@RequiredArgsConstructor
public class GetAdminStatsUseCase implements UsecaseWithoutInput<AdminStatsResponse> {
    
    private final AccountPort accountPort;
    private final OrganizationPort organizationPort;
    private final ContactMessagePort contactMessagePort;
    private final ConversationPort conversationPort;
    
    @Override
    public AdminStatsResponse execute() {
        // Count accounts by type
        long totalOrganizations = accountPort.countByType(ORG);
        long totalConsumers = accountPort.countByType(CONSUMER);
        long totalAdmins = accountPort.countByType(ADMIN);
        
        // Count pending organizations (not approved)
        long pendingOrganizations = organizationPort.countPending();
        
        // Count contact messages
        long totalContactMessages = contactMessagePort.countByRead(false) + contactMessagePort.countByRead(true);
        long unreadContactMessages = contactMessagePort.countByRead(false);
        
        // Count conversations (approximate - using a simple approach)
        // Note: This is a simplified count. In production, you might want a dedicated stats query
        long totalConversations = conversationPort.countAll();
        
        return new AdminStatsResponse(
                totalOrganizations,
                totalConsumers,
                totalAdmins,
                pendingOrganizations,
                totalContactMessages,
                unreadContactMessages,
                totalConversations
        );
    }
}
