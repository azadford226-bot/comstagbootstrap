package com.hivecontrolsolutions.comestag.core.application.usecase.auth;

import com.hivecontrolsolutions.comestag.base.core.error.exception.BusinessException;
import com.hivecontrolsolutions.comestag.core.application.entity.input.RegisterInput;
import com.hivecontrolsolutions.comestag.core.application.service.OtpService;
import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import com.hivecontrolsolutions.comestag.core.domain.port.AccountPort;
import com.hivecontrolsolutions.comestag.core.domain.port.ConsumerPort;
import com.hivecontrolsolutions.comestag.core.domain.port.OrganizationPort;
import com.hivecontrolsolutions.comestag.core.domain.port.VerificationCodePort;
import com.hivecontrolsolutions.comestag.core.domain.service.EmailNotification;
import com.hivecontrolsolutions.comestag.core.domain.service.OrgEmailGuard;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for AuthRegisterUseCase
 */
@ExtendWith(MockitoExtension.class)
class AuthRegisterUseCaseTest {

    @Mock
    private AccountPort accountPort;

    @Mock
    private OrganizationPort organizationPort;

    @Mock
    private ConsumerPort consumerPort;

    @Mock
    private OrgEmailGuard orgEmailGuard;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private VerificationCodePort verificationCodePort;

    @Mock
    private OtpService otpService;

    @Mock
    private EmailNotification emailNotification;

    @InjectMocks
    private AuthRegisterUseCase authRegisterUseCase;

    private RegisterInput registerInput;

    @BeforeEach
    void setUp() {
        registerInput = new RegisterInput(
                AccountType.ORG,
                "test@company.com",
                "password123",
                "Test Company",
                1L,
                LocalDate.now().minusYears(1),
                "10-50",
                "United States",
                "California",
                "San Francisco",
                "https://example.com",
                "Who we are",
                "What we do",
                Set.of()
        );
    }

    @Test
    void execute_ValidOrgRegistration_Success() {
        // Arrange
        doNothing().when(orgEmailGuard).isIndividualEmail(anyString());
        when(accountPort.getByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        UUID userId = UUID.randomUUID();
        when(accountPort.save(any(AccountDm.class))).thenReturn(AccountDm.builder()
                .id(userId)
                .email("test@company.com")
                .build());
        when(otpService.getCodeHash(anyString(), anyString())).thenReturn("hashedCode");
        doNothing().when(emailNotification).sendVerificationMail(anyString(), anyString(), anyString());
        when(verificationCodePort.getByUserId(userId)).thenReturn(
                com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm.builder().userId(userId).build()
        );

        // Act
        assertDoesNotThrow(() -> authRegisterUseCase.execute(registerInput));

        // Assert
        verify(orgEmailGuard).isIndividualEmail("test@company.com");
        verify(orgEmailGuard).hasMxRecords("test@company.com");
        verify(accountPort).getByEmail("test@company.com");
        verify(accountPort).save(any(AccountDm.class));
        verify(organizationPort).save(any());
        verify(verificationCodePort).updateOrSave(any());
        verify(emailNotification).sendVerificationMail(anyString(), anyString(), anyString());
    }

    @Test
    void execute_EmailAlreadyExists_ThrowsBusinessException() {
        // Arrange
        doNothing().when(orgEmailGuard).isIndividualEmail(anyString());
        when(accountPort.getByEmail(anyString())).thenReturn(Optional.of(AccountDm.builder().build()));

        // Act & Assert
        assertThrows(BusinessException.class, () -> authRegisterUseCase.execute(registerInput));
        verify(accountPort).getByEmail("test@company.com");
        verify(accountPort, never()).save(any());
    }

    @Test
    void execute_InvalidOrgEmail_ThrowsBusinessException() {
        // Arrange
        doThrow(new BusinessException(null, "Invalid email"))
                .when(orgEmailGuard).isIndividualEmail(anyString());

        // Act & Assert
        assertThrows(BusinessException.class, () -> authRegisterUseCase.execute(registerInput));
        verify(orgEmailGuard).isIndividualEmail("test@company.com");
        verify(accountPort, never()).save(any());
    }

    @Test
    void execute_ValidConsumerRegistration_Success() {
        // Arrange
        RegisterInput consumerInput = new RegisterInput(
                AccountType.CONSUMER,
                "consumer@example.com",
                "password123",
                "John Doe",
                2L,
                LocalDate.now().minusYears(2),
                "Individual",
                "Canada",
                "Ontario",
                "Toronto",
                "https://consumer.example.com",
                null,
                null,
                Set.of(1L, 2L)
        );

        when(accountPort.getByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        UUID userId = UUID.randomUUID();
        when(accountPort.save(any(AccountDm.class))).thenReturn(AccountDm.builder()
                .id(userId)
                .email("consumer@example.com")
                .build());
        when(otpService.getCodeHash(anyString(), anyString())).thenReturn("hashedCode");
        doNothing().when(emailNotification).sendVerificationMail(anyString(), anyString(), anyString());
        when(verificationCodePort.getByUserId(userId)).thenReturn(
                com.hivecontrolsolutions.comestag.core.domain.model.VerificationCodeDm.builder().userId(userId).build()
        );

        // Act
        assertDoesNotThrow(() -> authRegisterUseCase.execute(consumerInput));

        // Assert
        verify(accountPort).getByEmail("consumer@example.com");
        verify(orgEmailGuard).hasMxRecords("consumer@example.com");
        verify(accountPort).save(any(AccountDm.class));
        verify(consumerPort).save(any());
        verify(verificationCodePort).updateOrSave(any());
    }
}
