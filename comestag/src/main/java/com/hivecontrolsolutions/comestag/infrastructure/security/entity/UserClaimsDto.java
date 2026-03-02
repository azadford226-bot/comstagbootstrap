package com.hivecontrolsolutions.comestag.infrastructure.security.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountStatus;
import com.hivecontrolsolutions.comestag.core.domain.model.enums.AccountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserClaimsDto implements UserDetails {
    private UUID id;
    private String username;
    private String email;
    private AccountType type;
    private AccountStatus status;
    private Instant createdAt;
    private Instant updatedAt;
    private List<String> authoritiesNames = List.of();

    @JsonIgnore
    Collection<GrantedAuthority> auth = new ArrayList<>();

    @Override
    public String getUsername() {
        return username != null ? username : (email != null ? email : id != null ? id.toString() : "");
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return null;
    }

    @JsonIgnore
    public Collection<GrantedAuthority> getAuthorities() {
        return auth;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }

    @JsonProperty("createdAt")
    public Long getCreatedAtEpochMillis() {
        return createdAt != null ? createdAt.toEpochMilli() : null;
    }

    @JsonProperty("updatedAt")
    public Long getUpdatedAtEpochMillis() {
        return updatedAt != null ? updatedAt.toEpochMilli() : null;
    }
}