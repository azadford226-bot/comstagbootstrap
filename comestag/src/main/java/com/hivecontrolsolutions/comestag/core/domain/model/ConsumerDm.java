package com.hivecontrolsolutions.comestag.core.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Getter
@Setter
@Builder
public class ConsumerDm {

    // Identity
    private UUID id;
    private String displayName;

    private IndustryDm industry;

    private Set<String> interests;
    private LocalDate established;
    private String size;

    private String website;

    private String phone;
    private String country;
    private String state;
    private String city;
    private int views;

    private UUID profileImageId;
    private UUID profileCoverId;

    private Instant createdAt;
    private Instant updatedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ConsumerDm that)) return false;
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
                '}';
    }
}
