package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.CertificateDm;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "certificates")
public class CertificateEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "org_id", nullable = false)
    private UUID orgId;

    @Column(name = "image_id", nullable = false)
    private UUID imageId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "body", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String body;

    @Column(name = "link")
    private String link;

    @Column(name = "certificate_date", nullable = false)
    private LocalDate certificateDate;

    @Column(name = "verified", nullable = false)
    private boolean verified;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "image_id",
            referencedColumnName = "id",
            insertable = false,
            updatable = false
    )
    private MediaEntity image;

    public CertificateDm toDm() {
        return CertificateDm.builder()
                .id(id)
                .orgId(orgId)
                .title(title)
                .body(body)
                .link(link)
                .certificateDate(certificateDate)
                .verified(verified)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .image(image != null ? image.toDm() : null)
                .build();
    }
}
