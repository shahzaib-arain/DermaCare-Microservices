package com.virtual.security_service.model;

public enum Role {
    ADMIN("ROLE_ADMIN"),
    DOCTOR("ROLE_DOCTOR"),
    PATIENT("ROLE_PATIENT");

    private final String authority;

    Role(String authority) {
        this.authority = authority;
    }

    public String getAuthority() {
        return authority;
    }
}