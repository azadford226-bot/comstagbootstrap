package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.EventDm;
import com.hivecontrolsolutions.comestag.core.domain.model.MediaDm;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.EventMode;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events")
public class EventEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "org_id", nullable = false)
    private UUID orgId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "body", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String body;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode", nullable = false)
    private EventMode mode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "industry_id")
    private IndustryEntity industry;

    @Column(name = "country")
    private String country;

    @Column(name = "state")
    private String state;

    @Column(name = "address")
    private String address;

    @Column(name = "city")
    private String city;

    @Column(name = "start_at", nullable = false)
    private OffsetDateTime startAt;

    @Column(name = "end_at")
    private OffsetDateTime endAt;

    @Column(name = "online_link")
    private String onlineLink;

    @Column(name = "viewers", nullable = false)
    private long viewers;

    @Column(name = "registered_count", nullable = false)
    private long registeredCount;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", nullable = false, insertable = false)
    private Instant updatedAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private List<EventMediaEntity> media;

    public EventDm toDm() {
        List<EventMediaEntity> safeMedia = media == null ? List.of() : media;
        List<MediaDm> mediaDms = new ArrayList<>();

        for (EventMediaEntity em : safeMedia) {
            if (em.getMedia() != null) {
                mediaDms.add(em.getMedia().toDm());
            }
        }

        return EventDm.builder()
                .id(id)
                .orgId(orgId)
                .title(title)
                .body(body)
                .mode(mode)
                .industry(industry.toDm())
                .country(country)
                .state(state)
                .city(city)
                .address(address)
                .startAt(startAt)
                .endAt(endAt)
                .onlineLink(onlineLink)
                .viewers(viewers)
                .registeredCount(registeredCount)
                .createdAt(createdAt)
                .updatedAt(updatedAt)
                .media(mediaDms)
                .build();
    }
}