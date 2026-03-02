package com.hivecontrolsolutions.comestag.core.application.usecase.message;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.MessageDm;
import com.hivecontrolsolutions.comestag.core.domain.port.MessagePort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class ListMessagesUseCase implements Usecase<ListMessagesUseCase.Input, Page<MessageDm>> {

    private final MessagePort messagePort;

    public record Input(UUID conversationId, int page, int size) {}

    @Override
    @Transactional(readOnly = true)
    public Page<MessageDm> execute(Input input) {
        return messagePort.findByConversationId(input.conversationId(), input.page(), input.size());
    }
}
