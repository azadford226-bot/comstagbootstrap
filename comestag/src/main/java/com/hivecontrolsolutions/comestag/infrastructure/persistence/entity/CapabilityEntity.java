package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.CapabilityDm;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "capabilities")
public class CapabilityEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "org_id", nullable = false)
    private UUID orgId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "body", nullable = false, columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String body;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "capability_id", referencedColumnName = "id")
    private List<CapabilityHashtagEntity> hashtags;

    public CapabilityDm toDm() {
        var safeHashtags = hashtags == null ? List.<CapabilityHashtagEntity>of() : hashtags;

        return CapabilityDm.builder()
                .id(id)
                .orgId(orgId)
                .title(title)
                .body(body)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .hashtags(
                        safeHashtags.stream()
                                .map(h -> h.getHashtag().toDm())
                                .toList()
                )
                .build();
    }
}