package com.hivecontrolsolutions.comestag.entrypoint.web.auth;

import com.hivecontrolsolutions.comestag.base.stereotype.Processor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

@Processor
@RequiredArgsConstructor
@RequestMapping("/v1/auth/oauth2")
public class OAuth2LoginProcessor {

    @PostMapping("/exchange")
    public ResponseEntity<Map<String, Object>> exchangeOAuthToken(
            @RequestBody Map<String, String> request) {
        String provider = request.get("provider");
        String email = request.get("email");

        return ResponseEntity.ok(Map.of(
                "status", "pending",
                "message", "OAuth2 configured. Set provider client IDs/secrets in environment variables to enable.",
                "provider", provider != null ? provider : "",
                "email", email != null ? email : ""
        ));
    }

    @GetMapping("/providers")
    public ResponseEntity<Map<String, Object>> getProviders() {
        return ResponseEntity.ok(Map.of(
                "providers", List.of(
                        Map.of("id", "google", "name", "Google", "enabled", true),
                        Map.of("id", "github", "name", "GitHub", "enabled", true),
                        /* Not registered in application.properties yet */
                        Map.of("id", "microsoft", "name", "Microsoft", "enabled", false),
                        Map.of("id", "linkedin", "name", "LinkedIn", "enabled", false)
                )
        ));
    }
}
