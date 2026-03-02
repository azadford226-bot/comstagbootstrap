package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.auth.AuthLogoutUseCase;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TOKEN_INVALID;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/auth")
public class AuthLogoutProcessor {

    private final AuthLogoutUseCase useCase;

    @PreAuthorize("hasAnyRole('CONSUMER','ORG')")
    @PostMapping("/logout")
    @Operation(summary = "Logout user",
            description = "Use this endpoint to logout user by sending refresh token")
    public ResponseEntity<Void> logout(@RequestHeader(name = AUTHORIZATION) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BusinessException(TOKEN_INVALID);
        }

        String refreshToken = authHeader.substring(7);
        useCase.execute(refreshToken);
        return ResponseEntity.ok().build();

    }

}
