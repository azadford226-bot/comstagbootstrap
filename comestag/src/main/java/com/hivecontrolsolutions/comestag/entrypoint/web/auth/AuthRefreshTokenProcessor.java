package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.auth.AuthRefreshTokenUseCase;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

@Processor
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthRefreshTokenProcessor {
    private final AuthRefreshTokenUseCase useCase;

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh token", description = "Use this endpoint to refresh token by sending refresh token")
    public ResponseEntity<?> refreshToken(@RequestHeader("Authorization") String refreshToken) {

        return ResponseEntity.ok()
                .body(
                        useCase.execute(refreshToken.substring(7))
                );
    }
}
