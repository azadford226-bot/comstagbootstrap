package com.hivecontrolsolutions.comestag.core.application.usecase.message;

import com.hivecontrolsolutions.comestag.base.core.usecase.UsecaseWithoutOutput;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.port.MessagePort;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class MarkConversationReadUseCase implements UsecaseWithoutOutput<MarkConversationReadUseCase.Input> {

    private final MessagePort messagePort;

    public record Input(UUID conversationId, UUID userId) {}

    @Override
    @Transactional
    public void execute(Input input) {
        messagePort.markConversationAsRead(input.conversationId(), input.userId());
    }
}
