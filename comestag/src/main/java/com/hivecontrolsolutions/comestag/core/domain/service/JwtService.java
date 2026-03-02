package com.hivecontrolsolutions.comestag.core.domain.service;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.RefreshTokenDm;
import com.hivecontrolsolutions.comestag.core.domain.port.RefreshTokenPort;
import com.hivecontrolsolutions.comestag.infrastructure.security.TokenOperation;
import com.hivecontrolsolutions.comestag.infrastructure.security.entity.UserClaimsDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.TOKEN_INVALID;
import static com.hivecontrolsolutions.comestag.core.constant.SecurityConstant.*;

@Component
@RequiredArgsConstructor
public class JwtService {

    private final RefreshTokenPort refreshTokenPort;
    private final TokenOperation tokenOperation;
    @Value("${" + AUTH_TOKEN_REFRESH_DURATION + "}")
    private long refreshTokenDuration;
    @Value("${" + AUTH_TOKEN_ACCESS_DURATION + "}")
    private long accessTokenDuration;

    public Map<String, String> issueTokens(AccountDm accountDm) {
        refreshTokenPort.invalidateByUserId(accountDm.getId());
        UUID tokenId = UUID.randomUUID();
        Instant now = Instant.now();
        UserClaimsDto userClaimsDto = getUserClaimsDto(accountDm);
        String accessToken = tokenOperation.generateAccessJwt(userClaimsDto, tokenId, now, accessTokenDuration);
        String refreshToken = tokenOperation.generateRefreshJwt(tokenId, accountDm.getId(), now, refreshTokenDuration);
        refreshTokenPort.save(RefreshTokenDm.builder()
                .tokenId(tokenId)
                .userId(accountDm.getId())
                .refreshToken(refreshToken)
                .expiryDate(now.plus(refreshTokenDuration, ChronoUnit.SECONDS))
                .valid(true)
                .build()
        );
        return Map.of(
                ACCESS_TOKEN, accessToken,
                REFRESH_TOKEN, refreshToken
        );
    }

    public Map<String, String> refreshTokens(UUID refreshTokenId, AccountDm accountDm) {
        RefreshTokenDm refreshTokenDm = refreshTokenPort.getById(refreshTokenId);
        if (!refreshTokenDm.isValid()) {
            throw new BusinessException(TOKEN_INVALID);
        }
        return issueTokens(accountDm);
    }

    public void logout(String refreshToken) {
        UUID refreshTokenId = tokenOperation.extractTokenId(refreshToken);
        refreshTokenPort.invalidateByTokenId(refreshTokenId);
    }
    private UserClaimsDto getUserClaimsDto(AccountDm accountDm) {
        return UserClaimsDto.builder()
                .id(accountDm.getId())
                .username(accountDm.getDisplayName())
                .email(accountDm.getEmail())
                .type(accountDm.getType())
                .status(accountDm.getStatus())
                .createdAt(accountDm.getCreatedAt())
                .updatedAt(accountDm.getUpdatedAt())
                .build();
    }
}