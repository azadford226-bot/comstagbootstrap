package com.hivecontrolsolutions.comestag.core.application.usecase.notification;


import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.NotificationQueryPort;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class GetUnreadCountUseCase implements Usecase<UUID, Long> {

    private final NotificationQueryPort queryPort;

    @Override
    public Long execute(UUID accountId) {
        return queryPort.countUnread(accountId);
    }
}
