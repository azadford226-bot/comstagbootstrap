package com.hivecontrolsolutions.comestag.entrypoint.web.profile;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserType;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PrivateConsProfileDto;
import com.hivecontrolsolutions.comestag.core.application.entity.PrivateOrgProfileDro;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.GetPrivateConsProfileUseCase;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.GetPrivateOrgProfileUseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.CONSUMER;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.ORG;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/profile")
public class GetPrivateProfileProcessor {

    private final GetPrivateOrgProfileUseCase orgUseCase;
    private final GetPrivateConsProfileUseCase consUseCase;

    @PreAuthorize(
            "(hasRole('CONSUMER') and hasAuthority('Profile_ACTIVE')) " +
                    "or (hasRole('ORG') and (hasAuthority('Profile_ACTIVE') or hasAuthority('Profile_PENDING')))"
    )
    @GetMapping
    @Operation(
            summary = "Get current user private profile",
            description = "Returns either an ORG profile or a CONSUMER profile depending on the authenticated account type."
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    oneOf = {
                                            PrivateOrgProfileDro.class,
                                            PrivateConsProfileDto.class
                                    }
                            )
                    )
            )
    })

    public ResponseEntity<?> getProfile(@CurrentUserId UUID currentUserId,
                                     @CurrentUserType AccountType type) {
        if (ORG.equals(type))
            return ResponseEntity.ok().body(orgUseCase.execute(currentUserId));
        else if (CONSUMER.equals(type))
            return ResponseEntity.ok().body(consUseCase.execute(currentUserId));

        return ResponseEntity.badRequest().build();
    }
}