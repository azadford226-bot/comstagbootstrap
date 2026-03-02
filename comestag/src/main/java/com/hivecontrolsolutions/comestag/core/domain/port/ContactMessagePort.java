package com.hivecontrolsolutions.comestag.core.domain.port;

import com.hivecontrolsolutions.comestag.core.domain.model.ContactMessageDm;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface ContactMessagePort {
    ContactMessageDm save(ContactMessageDm message);
    
    Page<ContactMessageDm> findAll(int page, int size);
    
    Page<ContactMessageDm> findByRead(boolean read, int page, int size);
    
    void markAsRead(UUID id);
    
    long countByRead(boolean read);
}
