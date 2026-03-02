package com.hivecontrolsolutions.comestag.core.domain.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.net.URI;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrganizationDm {

    private UUID id;
    private String displayName;
    private IndustryDm industry;
    private LocalDate established;
    private String website;
    private String size;

    private boolean approved;

    private String whoWeAre;
    private String whatWeDo;

    private long reviewsCount;
    private long ratingSum;

    private String phone;
    private String country;
    private String state;
    private String city;
    private int views;

    private UUID profileImageId;
    private UUID profileCoverId;

    private Instant createdAt;
    private Instant updatedAt;


    public boolean canPostFeeds() {
        return approved;
    }

    public void approve() {
        this.approved = true;
    }

    public void revokeApproval() {
        this.approved = false;
    }

    public void updateProfile(String displayName,
                              String website,
                              String whoWeAre,
                              String whatWeDo
    ) {

        if (website != null) this.website = normalizeUrlOrNull(website);

        if (whoWeAre != null) this.whoWeAre = whoWeAre;
        if (whatWeDo != null) this.whatWeDo = whatWeDo;

    }

    private static String requireNonBlank(String val, String field) {
        if (val == null || val.isBlank()) {
            throw new IllegalArgumentException(field + " must not be blank");
        }
        return val.trim();
    }

    private static String normalizeUrlOrNull(String raw) {
        var v = raw.trim();
        if (v.isEmpty()) return null;
        // Add scheme if missing (basic normalization; adapters can do stricter checks)
        if (!v.matches("^[a-zA-Z][a-zA-Z0-9+.-]*://.*$")) {
            v = "https://" + v;
        }
        try {
            URI.create(v); // basic validation
            return v;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid website URL");
        }
    }

    private static String normalizeCountryOrNull(String cc) {
        var v = cc.trim();
        if (v.isEmpty()) return null;
        if (v.length() != 2) throw new IllegalArgumentException("countryCode must be ISO-3166 alpha-2");
        return v.toUpperCase();
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof OrganizationDm that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "OrganizationDm{" +
                "id=" + id +
                ", approved=" + approved +
                '}';
    }
}