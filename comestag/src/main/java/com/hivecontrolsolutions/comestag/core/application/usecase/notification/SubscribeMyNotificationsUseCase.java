package com.hivecontrolsolutions.comestag.core.application.usecase.notification;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.application.entity.input.SubscribeMyNotificationsInput;
import com.hivecontrolsolutions.comestag.entrypoint.stream.notification.NotificationSseRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@UseCase
@RequiredArgsConstructor
public class SubscribeMyNotificationsUseCase implements Usecase<SubscribeMyNotificationsInput, SseEmitter> {

    private final NotificationSseRegistry registry;

    @Override
    public SseEmitter execute(SubscribeMyNotificationsInput input) {
        return registry.register(input.accountId());
    }

}