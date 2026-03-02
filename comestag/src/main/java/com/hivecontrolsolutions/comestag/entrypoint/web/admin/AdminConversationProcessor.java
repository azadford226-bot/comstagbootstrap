package com.hivecontrolsolutions.comestag.entrypoint.web.admin;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.admin.ListAllConversationsUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.ConversationDm;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/admin/conversations")
@RestController
public class AdminConversationProcessor {
    
    private final ListAllConversationsUseCase listAllConversationsUseCase;
    
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    @Operation(summary = "List all conversations",
            description = "Returns a paginated list of all conversations between users.")
    public ResponseEntity<PageResult<ConversationDm>> listAllConversations(
            @RequestParam(defaultValue = "0") int page) {
        Page<ConversationDm> result = listAllConversationsUseCase.execute(page);
        return ResponseEntity.ok(PageResult.of(result));
    }
}
