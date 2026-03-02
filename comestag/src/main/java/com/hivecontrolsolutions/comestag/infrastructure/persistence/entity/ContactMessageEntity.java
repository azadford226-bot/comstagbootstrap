package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "contact_messages")
public class ContactMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", updatable = false)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    @JdbcTypeCode(SqlTypes.VARCHAR)
    private String email;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String message;

    @Column(nullable = false)
    @Builder.Default
    private boolean read = false;

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
}
