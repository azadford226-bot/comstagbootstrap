package com.hivecontrolsolutions.comestag.entrypoint.web.profile;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateConsProfileInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.UpdateConsProfileUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.profile.UpdateConsProfileRequest;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/profile")
public class UpdateConsProfileProcessor {

    private final UpdateConsProfileUseCase useCase;

    @PreAuthorize("(hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE'))")
    @PutMapping("/cons")
    @Operation(summary = "Update consumer profile")
    public ResponseEntity<?> process(@CurrentUserId UUID currentUserId,
                                     @Valid @RequestBody UpdateConsProfileRequest request
    ) {
        return ResponseEntity.ok().body(useCase.execute(toInput(currentUserId, request)));
    }

    private UpdateConsProfileInput toInput(UUID currentUserId, UpdateConsProfileRequest request) {
        return new UpdateConsProfileInput(
                currentUserId,
                request.displayName(),
                request.website(),
                request.industryId(),
                request.established(),
                request.interests(),
                request.size(),
                request.phone(),
                request.country(),
                request.state(),
                request.city()
        );
    }
}
