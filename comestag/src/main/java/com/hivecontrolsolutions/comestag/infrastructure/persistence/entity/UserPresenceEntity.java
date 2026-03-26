package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user_presence")
public class UserPresenceEntity {

    @Id
    @Column(name = "account_id")
    private UUID accountId;

    @Column(name = "last_seen", nullable = false)
    private Instant lastSeen;

    @Column(name = "is_online")
    private boolean online;
}
