package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.AccountEmailChangeLogMd;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "account_email_change_log")
public class AccountEmailChangeLogEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "account_id", nullable = false, updatable = false,insertable = false)
    private UUID accountId;

    @Column(name = "old_email", nullable = false)
    private String oldEmail;

    @Column(name = "new_email", nullable = false)
    private String newEmail;

    @Column(name = "changed_at", nullable = false, insertable = false, updatable = false)
    private Instant changedAt;


    public AccountEmailChangeLogMd toMd() {
        return AccountEmailChangeLogMd.builder()
                .id(this.id)
                .accountId(this.accountId)
                .oldEmail(this.oldEmail)
                .newEmail(this.newEmail)
                .changedAt(this.changedAt)
                .build();
    }
}