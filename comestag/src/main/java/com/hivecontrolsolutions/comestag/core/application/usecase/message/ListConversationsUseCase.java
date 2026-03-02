package com.hivecontrolsolutions.comestag.core.application.usecase.message;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@UseCase
@RequiredArgsConstructor
public class ListConversationsUseCase implements Usecase<ListConversationsUseCase.Input, Page<ConversationDm>> {

    private final ConversationPort conversationPort;

    public record Input(UUID userId, String search, int page, int size) {}

    @Override
    @Transactional(readOnly = true)
    public Page<ConversationDm> execute(Input input) {
        if (input.search() != null && !input.search().trim().isEmpty()) {
            return conversationPort.findByParticipantIdWithSearch(
                    input.userId(), 
                    input.search().trim(), 
                    input.page(), 
                    input.size()
            );
        } else {
            return conversationPort.findByParticipantId(
                    input.userId(), 
                    input.page(), 
                    input.size()
            );
        }
    }
}
