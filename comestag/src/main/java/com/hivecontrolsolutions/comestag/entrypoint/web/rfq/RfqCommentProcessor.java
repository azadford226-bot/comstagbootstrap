package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PageResult;
import com.hivecontrolsolutions.comestag.core.domain.port.RfqPort;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.CreateRfqCommentRequest;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.entity.RfqCommentEntity;
import com.hivecontrolsolutions.comestag.infrastructure.persistence.repo.RfqCommentRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;
import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/rfq")
public class RfqCommentProcessor {

    private final RfqPort rfqPort;
    private final RfqCommentRepository commentRepository;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping("/{rfqId}/comments")
    public ResponseEntity<?> create(@CurrentUserId UUID currentUserId,
                                    @PathVariable UUID rfqId,
                                    @Valid @RequestBody CreateRfqCommentRequest request) {
        rfqPort.getById(rfqId);
        RfqCommentEntity comment = new RfqCommentEntity();
        comment.setRfqId(rfqId);
        comment.setAccountId(currentUserId);
        comment.setBody(request.body().trim());
        return ResponseEntity.status(201).body(Map.of("id", commentRepository.save(comment).getId()));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @GetMapping("/{rfqId}/comments")
    public ResponseEntity<?> list(@PathVariable UUID rfqId,
                                  @Min(0) @Max(100) int page,
                                  @Min(1) @Max(100) int size) {
        rfqPort.getById(rfqId);
        return ResponseEntity.ok(PageResult.of(commentRepository.findByRfqIdOrderByCreatedAtAsc(
                rfqId, PageRequest.of(page, size))));
    }

    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE')")
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> delete(@CurrentUserId UUID currentUserId, @PathVariable UUID commentId) {
        return commentRepository.findById(commentId)
                .filter(comment -> comment.getAccountId().equals(currentUserId))
                .map(comment -> {
                    commentRepository.delete(comment);
                    return ResponseEntity.ok(Map.of("deleted", true));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}