package com.hivecontrolsolutions.comestag.core.application.usecase.events;


import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.EventPort;
import com.hivecontrolsolutions.comestag.core.domain.port.EventRegistrationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class RegisterToEventUseCase implements UsecaseWithoutOutput<RegisterToEventUseCase.Input> {

    private final EventPort eventPort;
    private final EventRegistrationPort registrationPort;

    public record Input(UUID eventId, UUID accountId) {}

    @Transactional
    @Override
    public void execute(Input input) {
        // ensure event exists
        eventPort.getById(input.eventId());
        registrationPort.register(input.eventId(), input.accountId());
    }
}