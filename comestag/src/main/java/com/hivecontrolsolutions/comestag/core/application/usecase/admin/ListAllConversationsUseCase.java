package com.hivecontrolsolutions.comestag.core.application.usecase.admin;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ConversationPort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

@UseCase
@RequiredArgsConstructor
public class ListAllConversationsUseCase implements Usecase<Integer, Page<ConversationDm>> {
    
    private final ConversationPort conversationPort;
    
    @Override
    public Page<ConversationDm> execute(Integer page) {
        return conversationPort.findAll(page, 20);
    }
}
