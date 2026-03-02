package com.hivecontrolsolutions.comestag.entrypoint.web.profile;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.UpdateOrgProfileInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.UpdateOrgProfileUseCase;
import com.hivecontrolsolutions.comestag.entrypoint.entity.profile.UpdateOrgProfileRequest;
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
public class UpdateOrgProfileProcessor {

    private final UpdateOrgProfileUseCase useCase;

    @PreAuthorize("(hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))")
    @PutMapping("/org")
    @Operation(summary = "Update organization profile")
    public ResponseEntity<?> process(@CurrentUserId UUID currentUserId,
                                     @Valid @RequestBody UpdateOrgProfileRequest request) {

        return ResponseEntity.ok().body(useCase.execute(toInput(currentUserId, request)));
    }

    private UpdateOrgProfileInput toInput(UUID currentUserId, UpdateOrgProfileRequest request) {
        return new UpdateOrgProfileInput(
                currentUserId,
                request.displayName(),
                request.website(),
                request.industryId(),
                request.established(),
                request.size(),
                request.whoWeAre(),
                request.whatWeDo(),
                request.phone(),
                request.country(),
                request.state(),
                request.city()
        );
    }
}
