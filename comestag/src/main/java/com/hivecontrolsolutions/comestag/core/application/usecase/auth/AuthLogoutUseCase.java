package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.usecase.Usecase;
import com.hivecontrolsolutions.comestag.base.stereotype.UseCase;
import com.hivecontrolsolutions.comestag.core.domain.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@UseCase
@RequiredArgsConstructor
public class AuthLogoutUseCase implements Usecase<String,Void> {
    private final JwtService jwtService;


    @Transactional
    @Override
    public Void execute(String refreshToken) {
        jwtService.logout(refreshToken);
        return null;
    }
}
