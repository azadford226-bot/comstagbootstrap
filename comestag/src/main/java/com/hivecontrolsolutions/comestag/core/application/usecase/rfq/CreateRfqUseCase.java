package com.hivecontrolsolutions.comestag.core.application.usecase.rfq;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateRfqInput;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus;
import com.hivecontrolsolutions.comestag.core.domain.port.MediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqMediaPort;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@UseCase
@RequiredArgsConstructor
public class CreateRfqUseCase implements UsecaseWithoutOutput<CreateRfqInput> {
    
    private final RfqPort rfqPort;
    private final MediaPort mediaPort;
    private final RfqMediaPort rfqMediaPort;
    
    @Transactional
    @Override
    public void execute(CreateRfqInput input) {
        var rfq = rfqPort.create(
                input.organizationId(),
                input.title(),
                input.description(),
                input.category(),
                input.industryId(),
                input.budget(),
                input.budgetCurrency(),
                input.deadline(),
                input.requirements(),
                input.visibility()
        );
        
        // Invite organizations if specified
        if (input.invitedOrganizationIds() != null && !input.invitedOrganizationIds().isEmpty()) {
            rfqPort.inviteOrganizations(rfq.getId(), input.invitedOrganizationIds());
        }
        
        // Link media if mediaIds provided
        Set<java.util.UUID> mediaIds = input.mediaIds() == null ? Set.of() : Set.copyOf(input.mediaIds());
        if (!mediaIds.isEmpty()) {
            // Validate that media belong to org and are UNLINKED
            Set<java.util.UUID> existedMediaIds = mediaPort.getExistingIdsByOrgIdAndIdIn(input.organizationId(), mediaIds)
                    .stream()
                    .filter(m -> m.getStatus() == MediaStatus.UNLINKED)
                    .map(MediaDm::getId)
                    .collect(Collectors.toSet());
            
            if (!existedMediaIds.isEmpty()) {
                rfqMediaPort.create(rfq.getId(), existedMediaIds);
            }
        }
    }
}


