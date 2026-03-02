package com.hivecontrolsolutions.comestag.core.application.usecase.rfq;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ListRfqsInput;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class ListRfqsUseCase implements Usecase<ListRfqsInput, Page<RfqDm>> {
    
    private final RfqPort rfqPort;
    
    @Transactional(readOnly = true)
    @Override
    public Page<RfqDm> execute(ListRfqsInput input) {
        if ("mine".equals(input.filter())) {
            return rfqPort.pageByOrganizationId(input.organizationId(), input.page(), input.size());
        } else if ("available".equals(input.filter())) {
            return rfqPort.pageAvailable(input.organizationId(), input.page(), input.size());
        } else if (input.status() != null) {
            return rfqPort.pageByStatus(input.status(), input.page(), input.size());
        } else if (input.industryId() != null) {
            return rfqPort.pageByIndustryId(input.industryId(), input.page(), input.size());
        } else {
            // Default: return all available
            return rfqPort.pageAvailable(input.organizationId(), input.page(), input.size());
        }
    }
}

