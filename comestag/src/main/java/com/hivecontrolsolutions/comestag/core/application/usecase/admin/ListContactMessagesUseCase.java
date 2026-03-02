package com.hivecontrolsolutions.comestag.core.application.usecase.admin;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.ContactMessageDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ContactMessagePort;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

@UseCase
@RequiredArgsConstructor
public class ListContactMessagesUseCase implements Usecase<ListContactMessagesUseCase.Input, Page<ContactMessageDm>> {
    
    private final ContactMessagePort contactMessagePort;
    
    @Override
    public Page<ContactMessageDm> execute(Input input) {
        if (input.unreadOnly()) {
            return contactMessagePort.findByRead(false, input.page(), 20);
        }
        return contactMessagePort.findAll(input.page(), 20);
    }
    
    public record Input(int page, boolean unreadOnly) {}
}
