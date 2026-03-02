package com.hivecontrolsolutions.comestag.entrypoint.web.debug;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/v1/debug")
@RequiredArgsConstructor
@Profile({"local", "dev", "stag"})
public class DebugPasswordProcessor {
    
    private final PasswordEncoder passwordEncoder;
    
    @PostMapping("/generate-hash")
    public Map<String, String> generateHash(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        String hash = passwordEncoder.encode(password);
        
        Map<String, String> response = new HashMap<>();
        response.put("password", password);
        response.put("hash", hash);
        response.put("message", "Generated BCrypt hash");
        
        return response;
    }
    
    @PostMapping("/verify-hash")
    public Map<String, Object> verifyHash(@RequestBody Map<String, String> request) {
        String password = request.get("password");
        String hash = request.get("hash");
        
        boolean matches = passwordEncoder.matches(password, hash);
        
        Map<String, Object> response = new HashMap<>();
        response.put("password", password);
        response.put("hash", hash);
        response.put("matches", matches);
        
        return response;
    }
}
