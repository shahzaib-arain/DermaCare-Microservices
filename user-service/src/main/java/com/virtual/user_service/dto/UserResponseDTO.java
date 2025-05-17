package com.virtual.user_service.dto;


import com.virtual.user_service.model.Role;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    private String id;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private boolean verified;
    private LocalDateTime createdAt;
    // Doctor-specific fields (null for non-doctors)
    private String degreeNumber;
    private String specialization;
    private Boolean doctorVerified;

}
