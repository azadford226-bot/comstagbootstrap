package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.core.application.entity.input.AuthLoginInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import com.hivecontrolsolutions.comestag.core.domain.service.OrgEmailGuard;
import com.hivecontrolsolutions.comestag.entrypoint.entity.auth.AuthLoginResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthLoginUseCase
 */
@ExtendWith(MockitoExtension.class)
class AuthLoginUseCaseTest {

    @Mock
    private AccountPort accountPort;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private VerificationCodePort verificationCodePort;

    @Mock
    private OtpService otpService;

    @Mock
    private EmailNotification emailNotification;

    @Mock
    private OrgEmailGuard orgEmailGuard;

    @InjectMocks
    private AuthLoginUseCase authLoginUseCase;

    private AuthLoginInput loginInput;
    private AccountDm accountDm;
    private UUID accountId;

    @BeforeEach
    void setUp() {
        accountId = UUID.randomUUID();
        loginInput = new AuthLoginInput("test@company.com", "password123");
        
        accountDm = AccountDm.builder()
                .id(accountId)
                .email("test@company.com")
                .passwordHash("$2a$10$encodedPassword")
                .type(AccountType.ORG)
                .status(AccountStatus.ACTIVE)
                .emailVerified(true)
                .createdAt(Instant.now())
                .build();
    }

    @Test
    void execute_ValidCredentials_ReturnsAuthLoginResponse() {
        // Arrange
        when(accountPort.getByEmail("test@company.com")).thenReturn(Optional.of(accountDm));
        when(passwordEncoder.matches("password123", accountDm.getPasswordHash())).thenReturn(true);
        when(otpService.getCodeHash(anyString(), anyString())).thenReturn("hashedCode");
        doNothing().when(emailNotification).sendVerificationCode(anyString(), anyString(), anyString());
        
        VerificationCodeDm verificationCodeDm = VerificationCodeDm.builder()
                .userId(accountId)
                .build();
        when(verificationCodePort.getByUserId(accountId)).thenReturn(verificationCodeDm);

        // Act
        AuthLoginResponse result = authLoginUseCase.execute(loginInput);

        // Assert
        assertNotNull(result);
        assertNotNull(result.userId());
        assertEquals(accountId, result.userId());
        verify(accountPort).getByEmail("test@company.com");
        verify(passwordEncoder).matches("password123", accountDm.getPasswordHash());
        verify(emailNotification).sendVerificationCode(anyString(), anyString(), anyString());
        verify(verificationCodePort).updateOrSave(any());
    }

    @Test
    void execute_InvalidEmail_ThrowsBusinessException() {
        // Arrange
        when(accountPort.getByEmail("test@company.com")).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(BusinessException.class, () -> authLoginUseCase.execute(loginInput));
        verify(accountPort).getByEmail("test@company.com");
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void execute_InvalidPassword_ThrowsBusinessException() {
        // Arrange
        when(accountPort.getByEmail("test@company.com")).thenReturn(Optional.of(accountDm));
        when(passwordEncoder.matches("password123", accountDm.getPasswordHash())).thenReturn(false);

        // Act & Assert
        assertThrows(BusinessException.class, () -> authLoginUseCase.execute(loginInput));
        verify(passwordEncoder).matches("password123", accountDm.getPasswordHash());
        verify(verificationCodePort, never()).updateOrSave(any());
    }

    @Test
    void execute_UnverifiedEmail_ThrowsBusinessException() {
        // Arrange
        accountDm = AccountDm.builder()
                .id(accountId)
                .email("test@company.com")
                .passwordHash("$2a$10$encodedPassword")
                .type(AccountType.ORG)
                .status(AccountStatus.ACTIVE)
                .emailVerified(false)
                .createdAt(Instant.now())
                .build();
        
        when(accountPort.getByEmail("test@company.com")).thenReturn(Optional.of(accountDm));
        when(passwordEncoder.matches("password123", accountDm.getPasswordHash())).thenReturn(true);

        // Act & Assert
        assertThrows(BusinessException.class, () -> authLoginUseCase.execute(loginInput));
    }
}
