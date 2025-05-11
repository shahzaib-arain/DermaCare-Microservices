package com.virtual.security_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

// Replicated DTO for UserResponseDTO in Security Service
@Data
public class UserResponseDTO {
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private String role; // Use String instead of Role for simplicity
    private boolean verified;
    private LocalDateTime createdAt;
}
