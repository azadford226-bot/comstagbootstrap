package com.hivecontrolsolutions.comestag.entrypoint.web.admin;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.admin.ListContactMessagesUseCase;
import com.hivecontrolsolutions.comestag.core.application.usecase.admin.MarkContactMessageReadUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.ContactMessageDm;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/admin/contact-messages")
@RestController
public class AdminContactProcessor {
    
    private final ListContactMessagesUseCase listContactMessagesUseCase;
    private final MarkContactMessageReadUseCase markContactMessageReadUseCase;
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    @Operation(summary = "List contact messages",
            description = "Returns a paginated list of contact form messages. Use unreadOnly=true to filter unread messages.")
    public ResponseEntity<PageResult<ContactMessageDm>> listContactMessages(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        Page<ContactMessageDm> result = listContactMessagesUseCase.execute(
                new ListContactMessagesUseCase.Input(page, unreadOnly));
        return ResponseEntity.ok(PageResult.of(result));
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{messageId}/read")
    @Operation(summary = "Mark contact message as read",
            description = "Marks a contact message as read.")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID messageId) {
        markContactMessageReadUseCase.execute(messageId);
        return ResponseEntity.ok().build();
    }
}
