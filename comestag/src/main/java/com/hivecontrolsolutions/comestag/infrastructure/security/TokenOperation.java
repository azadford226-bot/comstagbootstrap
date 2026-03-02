package com.hivecontrolsolutions.comestag.infrastructure.security;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import com.hivecontrolsolutions.comestag.infrastructure.security.entity.UserClaimsDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.function.Function;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TOKEN_INVALID;
import static com.hivecontrolsolutions.comestag.core.constant.SecurityConstant.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class TokenOperation {

    @Value("${" + AUTH_TOKEN_USER_SECRET_KEY + "}")
    private CharSequence jwtSecretKey;
    private static SecretKey secretKey = null;

    public String generateAccessJwt(UserClaimsDto userClaims, UUID tokenId, Instant now, long accessTokenDuration) {

        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN_ID_KEY, tokenId);
        claims.put(USER_KEY, userClaims);

        return generateJwt(claims, now, accessTokenDuration);
    }

    public String generateRefreshJwt(UUID tokenId, UUID userId, Instant now, long refreshTokenDuration) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN_ID_KEY, tokenId);
        claims.put(USER_ID_KEY, userId);
        return generateJwt(claims, now, refreshTokenDuration);
    }

    private String generateJwt(Map<String, Object> claims, Instant now, long expireAfterDuration) {
        return Jwts.builder()
                .claims()
                .add(claims)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(expireAfterDuration)))
                .and()
                .signWith(getSigningKey())
                //                .compressWith(DEF)
                .compact();
    }

    private SecretKey getSigningKey() {

        if (secretKey == null) {
            byte[] keyBytes = Decoders.BASE64.decode(jwtSecretKey);
            secretKey = Keys.hmacShaKeyFor(keyBytes);
        }
        return secretKey;

    }

    @SuppressWarnings("unchecked")
    public String extractTokenIdFromClaims(String token) {
        return (String) extractClaims(token).get(TOKEN_ID_KEY);
    }

    @SuppressWarnings("unchecked")
    public UserClaimsDto extractUserFromClaims(String token) {
        Map<String, Object> userMap = (Map<String, Object>) extractClaims(token).get(USER_KEY);
        if (userMap == null) {
            throw new BusinessException(TOKEN_INVALID);
        }

        return mapToUserClaims(userMap);
    }

    private Claims extractClaims(String token) {
        try {
            return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
        } catch (Exception e) {
            throw new BusinessException(TOKEN_INVALID);
        }
    }

    public UUID extractTokenId(String token) {
        Object raw = extractClaims(token).get(TOKEN_ID_KEY);
        if (raw == null) {
            throw new BusinessException(TOKEN_INVALID, "Couldn't extract token id");
        }
        return UUID.fromString(raw.toString());
    }

    public UUID extractUserId(String token) {
        Object raw = extractClaims(token).get(USER_ID_KEY);
        if (raw == null) {
            throw new BusinessException(TOKEN_INVALID, "Couldn't extract user id");
        }
        return UUID.fromString(raw.toString());
    }

    public String extractTokenId(Claims claims) {
        return claims.get(TOKEN_ID_KEY).toString();
    }

    public UserClaimsDto extractUserClaims(String token) {
        return (UserClaimsDto) extractClaims(token).get(USER_KEY);
    }

    public UserClaimsDto extractUserClaims(Claims claims) {
        return (UserClaimsDto) claims.get(USER_KEY);
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).isBefore(LocalDateTime.now());
    }

    public boolean isTokenExpired(Claims claims) {
        return extractExpiration(claims).atZone(ZoneId.systemDefault())
                .toLocalDateTime().isBefore(LocalDateTime.now());
    }


    private LocalDateTime extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration).toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    private Instant extractExpiration(Claims claims) {
        return claims.getExpiration().toInstant();
    }


    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractClaims(token);
        return claimsResolver.apply(claims);
    }

    @SuppressWarnings("unchecked")
    private UserClaimsDto mapToUserClaims(Map<String, Object> userMap) {
        UUID id = UUID.fromString((String) userMap.get("id"));
        String username = (String) userMap.get("username");
        String email = (String) userMap.get("email");
        AccountType type = AccountType.valueOf((String) userMap.get("type"));
        AccountStatus status = AccountStatus.valueOf((String) userMap.get("status"));
        List<String> roles = (List<String>) userMap.getOrDefault("roles", List.of());

        return UserClaimsDto.builder()
                .id(id)
                .username(username)
                .email(email)
                .type(type)
                .status(status)
                .authoritiesNames(roles)
                .build();
    }

}