package com.hivecontrolsolutions.comestag.entrypoint.web.rfq;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.CreateRfqInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.rfq.CreateRfqUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.RfqDm;
import com.hivecontrolsolutions.comestag.entrypoint.entity.rfq.CreateRfqRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

import static org.springframework.http.HttpStatus.CREATED;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/rfq")
public class CreateRfqProcessor {
    
    private final CreateRfqUseCase useCase;
    
    @PreAuthorize("hasRole('ORG') and hasAuthority('Profile_ACTIVE')")
    @PostMapping
    @Operation(summary = "Create RFQ",
            description = "Create a new Request for Quotation. Organization must be authenticated and active.")
    public ResponseEntity<?> createRfq(@CurrentUserId UUID currentUserId,
                                       @Valid @RequestBody CreateRfqRequest request) {
        useCase.execute(CreateRfqInput.builder()
                .organizationId(currentUserId)
                .title(request.title())
                .description(request.description())
                .category(request.category())
                .industryId(request.industryId())
                .budget(request.budget())
                .budgetCurrency(request.budgetCurrency())
                .deadline(request.deadline())
                .requirements(request.requirements())
                .visibility(RfqDm.RfqVisibility.valueOf(request.visibility()))
                .invitedOrganizationIds(request.invitedOrganizationIds())
                .mediaIds(request.mediaIds())
                .build());
        return ResponseEntity.status(CREATED).build();
    }
}


