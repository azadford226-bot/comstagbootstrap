package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AuthVerifyOtpInput;
import com.hivecontrolsolutions.comestag.core.application.usecase.auth.AuthVerifyCodeUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.core.constant.ProcessorConstant.IDENTIFIER;

@Processor
@Validated
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthTokenProcessor {

    private final AuthVerifyCodeUseCase verifyCodeUC;

    @PostMapping("/token")
    @Operation(
            summary = "Verify the 6-digit code and complete login",
            description = """
                    There is no need to authenticate this endpoint.
                    
                    Request parameter:
                    - identifier: {userId}_{6-digit-code}
                    
                    Example:
                    76f1804f-e2d3-4695-909b-cd6bf8b112ba_185984
                    
                    Where:
                    - userId is the value returned from the Login endpoint.
                    - 6-digit-code is the verification code sent by email.
                    
                    The endpoint splits identifier into userId and code, validates them,
                    and completes the verification / login flow if they are valid.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Login successful – token pair returned",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "Success",
                                    value = """
                                            {
                                              "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                                              "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh..."
                                            }
                                            """
                            )
                    )
            )

    }

    )
    public ResponseEntity<Map<String, String>> verify(
            @RequestParam(name = IDENTIFIER)
            @Pattern(
                    regexp = "^(?i)[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}_\\d{6}$",
                    message = "identifier  not valid")
            String identifier
    ) {
        String userId = identifier.split("_")[0];
        String code = identifier.split("_")[1];
        var tokens = verifyCodeUC.execute(toLoginInput(UUID.fromString(userId), code));
        return ResponseEntity.ok(tokens);
    }

    private AuthVerifyOtpInput toLoginInput(UUID userId, String code) {
        return new AuthVerifyOtpInput(userId, code);
    }

}
