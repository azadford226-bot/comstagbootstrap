package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaStatus;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.MediaType;
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
@Table(name = "media")
public class MediaEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "owner_account_id")
    private UUID ownerAccountId;

    @Column(name = "uri", nullable = false)
    private String uri;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MediaStatus status = MediaStatus.UNLINKED;

    @Enumerated(EnumType.STRING)
    @Column(name = "media_type", nullable = false)
    private MediaType mediaType;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", updatable = false, insertable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", insertable = false)
    private Instant updatedAt;

    public MediaDm toDm() {
        return MediaDm.builder()
                .id(this.id)
                .ownerAccountId(this.ownerAccountId)
                .uri(this.uri)
                .status(this.status)
                .mediaType(this.mediaType)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }
}