package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.ConsumerDm;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Generated;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "consumers")
public class ConsumerEntity {

    @Id
    @Column(name = "account_id", nullable = false)
    private UUID id;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "website", nullable = false)
    private String website;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "industry_id", nullable = false)
    private IndustryEntity industry;

    @Column(name = "established", nullable = false)
    private LocalDate established;

    @Column(name = "interests", columnDefinition = "text")
    private String interests;

    @Column(name = "size")
    private String size;

    @Column(name = "phone", columnDefinition = "text")
    private String phone;

    @Column(name = "country", columnDefinition = "text")
    private String country;

    @Column(name = "state", columnDefinition = "text")
    private String state;

    @Column(name = "city", columnDefinition = "text")
    private String city;

    @Column(name = "views", columnDefinition = "text")
    private int views;

    @Column(name = "profile_image_id", insertable = false, updatable = false)
    private UUID profileImageId;

    @Column(name = "profile_cover_id", insertable = false, updatable = false)
    private UUID profileCoverId;

    @Setter(AccessLevel.NONE)
    @Column(name = "created_at", updatable = false, insertable = false)
    @Generated
    private Instant createdAt;

    @Setter(AccessLevel.NONE)
    @Column(name = "updated_at", insertable = false)
    @Generated
    private Instant updatedAt;

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }

    public ConsumerDm toDm() {
        return ConsumerDm.builder()
                .id(this.id)
                .displayName(this.displayName)
                .website(this.website)
                .established(this.established)
                .interests(stringTInterests(this.interests))
                .size(this.size)
                .industry(this.industry.toDm())
                .phone(this.phone)
                .country(this.country)
                .state(this.state)
                .city(this.city)
                .views(this.views)
                .profileImageId(this.profileImageId)
                .profileCoverId(this.profileCoverId)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .build();
    }

    public static ConsumerEntity fromDm(ConsumerDm d) {
        return ConsumerEntity.builder()
                .id(d.getId())
                .displayName(d.getDisplayName())
                .website(d.getWebsite())
                .established(d.getEstablished())
                .interests(interestsToString(d.getInterests()))
                .size(d.getSize())
                .industry(IndustryEntity.builder().id(d.getIndustry().getId()).build())
                .phone(d.getPhone())
                .country(d.getCountry())
                .state(d.getState())
                .city(d.getCity())
                .views(d.getViews())
                .profileImageId(d.getProfileImageId())
                .profileCoverId(d.getProfileCoverId())
                .build();
    }

    public void setInterests(Set<String> interests) {
        this.interests = interestsToString(interests);
    }

    public static String interestsToString(Set<String> interests) {
        if (interests == null || interests.isEmpty()) {
            return null;
        }

        return interests.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> s.toLowerCase(Locale.ROOT))
                .distinct()
                .collect(Collectors.joining("|", "|", "|"));
    }

    public Set<String> stringTInterests(String stringInterests) {
        if (stringInterests == null || stringInterests.isBlank()) {
            return Collections.emptySet();
        }

        // IMPORTANT: "|" is special in regex, so we must escape it: "\\|"
        return Arrays.stream(stringInterests.split("\\|"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

}
