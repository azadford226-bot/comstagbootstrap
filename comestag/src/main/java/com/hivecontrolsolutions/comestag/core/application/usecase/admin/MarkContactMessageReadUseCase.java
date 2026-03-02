package com.hivecontrolsolutions.comestag.core.application.usecase.admin;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.ContactMessagePort;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class MarkContactMessageReadUseCase implements UsecaseWithoutOutput<UUID> {
    
    private final ContactMessagePort contactMessagePort;
    
    @Override
    public void execute(UUID messageId) {
        contactMessagePort.markAsRead(messageId);
    }
}
