package com.hivecontrolsolutions.comestag.core.application.usecase.events;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.ListRecommendedEventInput;
import com.hivecontrolsolutions.comestag.core.domain.model.EventDm;
import com.hivecontrolsolutions.comestag.core.domain.port.EventPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_NOT_EXIST;

@UseCase
@RequiredArgsConstructor
public class ListRecommendedEventsUseCase implements Usecase<ListRecommendedEventInput, Page<EventDm>> {

    private final OrganizationPort orgPort;
    private final EventPort eventPort;

    @Transactional(readOnly = true)
    @Override
    public Page<EventDm> execute(ListRecommendedEventInput input) {
        var org = orgPort.getById(input.accountId())
                .orElseThrow(() -> new BusinessException(ACCOUNT_NOT_EXIST));

        return eventPort.pageByLocationAndIndustry(
                org.getCountry(),
                org.getState(),
                org.getCity(),
                org.getIndustry().getId(),
                input.page(),
                input.size()
        );
    }
}
