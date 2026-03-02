package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.domain.model.NotificationViewDm;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationQueryPort;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class ListMyNotificationsUseCase implements Usecase<ListMyNotificationsUseCase.Input, PageResult<NotificationViewDm>> {

    private final NotificationQueryPort queryPort;

    @Override
    public PageResult<NotificationViewDm> execute(Input input) {
        return queryPort.listMy(input.accountId(), input.page(), input.size());
    }

    public record Input(UUID accountId, int page, int size) {}
}
