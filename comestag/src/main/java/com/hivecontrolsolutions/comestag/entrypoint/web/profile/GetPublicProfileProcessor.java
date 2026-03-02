package com.hivecontrolsolutions.comestag.entrypoint.web.profile;

import com.hivecontrolsolutions.comestag.base.stereotype.CurrentUserId;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.PublicConsProfileDro;
import com.hivecontrolsolutions.comestag.core.application.entity.PublicOrgProfileDro;
import com.hivecontrolsolutions.comestag.core.application.entity.input.GetPublicProfileInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.profile.GetPublicProfileUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/profile")
public class GetPublicProfileProcessor {

    private final GetPublicProfileUseCase orgUseCase;
    @PreAuthorize("hasAnyRole('CONSUMER','ORG') and hasAuthority('Profile_ACTIVE') ")
    @GetMapping("/{userId}")
    @Operation(
            summary = "Get current specific user public profile",
            description = "Returns either an ORG profile or a CONSUMER profile depending on the user id"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile found",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(
                                    oneOf = {
                                            PublicOrgProfileDro.class,
                                            PublicConsProfileDro.class
                                    }
                            )
                    )
            )
    })

    public ResponseEntity<?> getProfile(@CurrentUserId UUID currentUserId,
                                        @PathVariable("userId") UUID userId) {
        var input = new GetPublicProfileInput(currentUserId, userId);
        return ResponseEntity.ok().body(orgUseCase.execute(input));
    }
}