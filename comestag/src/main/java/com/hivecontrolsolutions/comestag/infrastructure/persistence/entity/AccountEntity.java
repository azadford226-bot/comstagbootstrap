package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;


import com.hivecontrolsolutions.comestag.core.domain.model.AccountDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus.PENDING;
import static com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType.CONSUMER;

@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "accounts")
public class AccountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Setter(AccessLevel.NONE)
    @Column(name = "id", updatable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "account_type")
    private AccountType type = CONSUMER;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "email", nullable = false, unique = true)
    @JdbcTypeCode(SqlTypes.VARCHAR)  // Java String, DB citext
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Getter
    @Column(nullable = false, columnDefinition = "account_status")
    private AccountStatus status = PENDING;

    @Column(nullable = false)
    private boolean emailVerified;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", updatable = false, insertable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", insertable = false)
    private Instant updatedAt;

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    public AccountDm toDm() {
        return AccountDm.builder()
                .id(this.id)
                .displayName(this.displayName)
                .type(this.type)
                .email(this.email)
                .passwordHash(this.passwordHash)
                .status(this.status)
                .emailVerified(this.emailVerified)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }

    public static AccountEntity fromDm(AccountDm d) {
        return AccountEntity.builder()
                .displayName(d.getDisplayName())
                .type(d.getType() == null ? CONSUMER : d.getType())
                .email(d.getEmail())
                .passwordHash(d.getPasswordHash())
                .status(d.getStatus() == null ? PENDING : d.getStatus())
                .emailVerified(Boolean.TRUE.equals(d.getEmailVerified()))
                .build();
    }
}