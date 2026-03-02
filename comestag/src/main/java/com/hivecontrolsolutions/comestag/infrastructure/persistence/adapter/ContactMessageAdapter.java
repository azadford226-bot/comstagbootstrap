package com.hivecontrolsolutions.comestag.infrastructure.persistence.adapter;

import com.hivecontrolsolutions.comestag.base.stereotype.Adapter;
import com.hivecontrolsolutions.comestag.core.domain.model.ContactMessageDm;
import com.hivecontrolsolutions.comestag.core.domain.port.ContactMessagePort;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.ContactMessageEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

@Adapter
@RequiredArgsConstructor
public class ContactMessageAdapter implements ContactMessagePort {
    
    private final ContactMessageRepository repository;
    
    @Override
    public ContactMessageDm save(ContactMessageDm message) {
        ContactMessageEntity entity = ContactMessageEntity.builder()
                .id(message.getId())
                .name(message.getName())
                .email(message.getEmail())
                .subject(message.getSubject())
                .message(message.getMessage())
                .read(message.isRead())
                .build();
        
        ContactMessageEntity saved = repository.save(entity);
        return toDm(saved);
    }
    
    @Override
    public Page<ContactMessageDm> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAllByOrderByCreatedAtDesc(pageable)
                .map(this::toDm);
    }
    
    @Override
    public Page<ContactMessageDm> findByRead(boolean read, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findByReadOrderByCreatedAtDesc(read, pageable)
                .map(this::toDm);
    }
    
    @Override
    public void markAsRead(UUID id) {
        repository.markAsRead(id);
    }
    
    @Override
    public long countByRead(boolean read) {
        return repository.countByRead(read);
    }
    
    private ContactMessageDm toDm(ContactMessageEntity entity) {
        return ContactMessageDm.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .subject(entity.getSubject())
                .message(entity.getMessage())
                .read(entity.isRead())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
