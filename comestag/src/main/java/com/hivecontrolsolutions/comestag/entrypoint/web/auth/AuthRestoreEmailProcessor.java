package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import com.hivecontrolsolutions.comestag.core.application.usecase.auth.AuthRestoreEmailUseCase;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import static com.hivecontrolsolutions.comestag.core.constant.ProcessorConstant.IDENTIFIER;

@Processor
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthRestoreEmailProcessor {
    private final AuthRestoreEmailUseCase authRestoreEmailUseCase;

    @PostMapping("/restore-email")
    @Operation(summary = "Restore email",
            description = """
                    1 .Use this endpoint to restore email via magic link.
                    2. It suppose that the email has been sent to the user after some one (owner or others) change user email.
                    3. The email should have url rout to webpage with param value
                       identifier.
                    4. This code should give to this endpoint as identifier param.
                    5. There is no need to authenticate this endpoint.
                    """)
    public void restoreEmail(@RequestParam(name = IDENTIFIER) String identifier) {
        authRestoreEmailUseCase.execute(identifier);
    }

}
