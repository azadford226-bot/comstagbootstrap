package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.service.JwtService;
import com.hivecontrolsolutions.comestag.infrastructure.security.TokenOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.base.core.error.entity.enums.InternalStatusError.ACCOUNT_NOT_EXIST;

@UseCase
@RequiredArgsConstructor
public class AuthRefreshTokenUseCase implements Usecase<String, Map<String, String>> {
    private final JwtService jwtService;
    private final TokenOperation tokenOperation;
    private final AccountPort accountPort;

    @Transactional
    @Override
    public Map<String, String> execute(String claims) {
        UUID tokenId = tokenOperation.extractTokenId(claims);
        UUID userId = tokenOperation.extractUserId(claims);
        AccountDm accountDm = accountPort.getById(userId).orElseThrow(
                () -> new BusinessException(ACCOUNT_NOT_EXIST)
        );
        return jwtService.refreshTokens(tokenId, accountDm);
    }
}
