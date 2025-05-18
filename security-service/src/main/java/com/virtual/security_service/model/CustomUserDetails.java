package com.virtual.security_service.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Objects;

public class CustomUserDetails implements UserDetails {
    private final String username;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean doctorVerified;

    public CustomUserDetails(String username,
                             Collection<? extends GrantedAuthority> authorities, boolean doctorVerified) {
        this.username = Objects.requireNonNull(username, "Username cannot be null");
        this.authorities = authorities != null ? authorities : Collections.emptyList();
        this.doctorVerified = doctorVerified;
    }
    public boolean isDoctorVerified() {
        return doctorVerified;
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return ""; // Not needed after authentication
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CustomUserDetails that = (CustomUserDetails) o;
        return username.equals(that.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }
}