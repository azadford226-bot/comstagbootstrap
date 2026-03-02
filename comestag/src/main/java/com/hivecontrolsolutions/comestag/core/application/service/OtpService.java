package com.hivecontrolsolutions.comestag.core.application.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    @Value("${verification_code.secret:secret}")
    private String secret;
    @Value("${verification_code.algo:HmacSHA256}")
    private String algo;
    private static final SecureRandom RNG = new SecureRandom();

    public String generateCode() {
        int n = RNG.nextInt(1_000_000);          // 0–999999
        String code = String.format("%06d", n);
        // Logging removed for production security
        return code;
    }

    public String getCodeHash(String code, String userId) {
        return hmacSha256(secret, code, userId);
    }

    /**
     * HMAC-SHA256(code + ":" + attemptId)
     */
    public String hmacSha256(String secret, String code, String userId) {
        try {
            Mac mac = Mac.getInstance(algo);
            mac.init(new SecretKeySpec(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8), algo));
            byte[] out = mac.doFinal((code + ":" + userId).getBytes(java.nio.charset.StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(out);
        } catch (Exception e) {
            throw new IllegalStateException("HMAC failure", e);
        }
    }
}
