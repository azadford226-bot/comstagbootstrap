package com.hivecontrolsolutions.comestag.entrypoint.web.message;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.MessageRepository;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.Instant;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/messages")
public class MessagePinProcessor {

    private final MessageRepository messageRepository;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PutMapping("/{messageId}/pin")
    @Transactional
    @Operation(summary = "Pin a message", description = "Pin a message in a conversation")
    public ResponseEntity<Void> pin(
            @CurrentUserId UUID currentUserId,
            @PathVariable UUID messageId) {
        var entity = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        entity.setPinned(true);
        entity.setPinnedAt(Instant.now());
        entity.setPinnedBy(currentUserId);
        messageRepository.save(entity);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PutMapping("/{messageId}/unpin")
    @Transactional
    @Operation(summary = "Unpin a message", description = "Unpin a message in a conversation")
    public ResponseEntity<Void> unpin(
            @CurrentUserId UUID currentUserId,
            @PathVariable UUID messageId) {
        var entity = messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
        entity.setPinned(false);
        entity.setPinnedAt(null);
        entity.setPinnedBy(null);
        messageRepository.save(entity);
        return ResponseEntity.ok().build();
    }
}
