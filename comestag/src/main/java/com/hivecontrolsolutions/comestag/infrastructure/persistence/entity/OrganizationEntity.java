package com.hivecontrolsolutions.comestag.infrastructure.persistence.entity;

import com.hivecontrolsolutions.comestag.core.domain.model.OrganizationDm;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "organizations")
public class OrganizationEntity {

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

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private AccountEntity account;

    @Column(name = "approved", nullable = false)
    private boolean approved;

    @Column(name = "who_we_are", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String whoWeAre;

    @Column(name = "what_we_do", columnDefinition = "text")
    @JdbcTypeCode(SqlTypes.LONGVARCHAR)
    private String whatWeDo;

    @Column(name = "reviews_count", nullable = false)
    private long reviewsCount;

    @Column(name = "rating_sum", nullable = false)
    private long ratingSum;

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

    @Column(name = "views")
    private int views;

    @Column(name = "profile_image_id")
    private UUID profileImageId;

    @Column(name = "profile_cover_id")
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

    public OrganizationDm toDm() {
        return OrganizationDm.builder()
                .id(this.id)
                .displayName(this.displayName)
                .industry(this.industry.toDm())
                .established(this.established)
                .website(this.website)
                .size(this.size)
                .approved(this.approved)
                .whoWeAre(this.whoWeAre)
                .whatWeDo(this.whatWeDo)
                .reviewsCount(this.reviewsCount)
                .ratingSum(this.ratingSum)
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

    public static OrganizationEntity fromDm(OrganizationDm d) {
        return OrganizationEntity.builder()
                .id(d.getId())
                .displayName(d.getDisplayName())
                .industry(IndustryEntity.builder().id(d.getIndustry().getId()).build())
                .established(d.getEstablished())
                .website(d.getWebsite())
                .size(d.getSize())
                .approved(d.isApproved())
                .whoWeAre(d.getWhoWeAre())
                .whatWeDo(d.getWhatWeDo())
                .reviewsCount(d.getReviewsCount())
                .ratingSum(d.getRatingSum())
                .phone(d.getPhone())
                .country(d.getCountry())
                .state(d.getState())
                .city(d.getCity())
                .views(d.getViews())
                .profileImageId(d.getProfileImageId())
                .profileCoverId(d.getProfileCoverId())
                .build();
    }
}
