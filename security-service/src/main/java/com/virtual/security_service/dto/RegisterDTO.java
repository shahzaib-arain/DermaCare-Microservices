package com.virtual.security_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

// Replicated DTO for RegisterDTO in Security Service
@Data
public class RegisterDTO {
    @NotBlank(message = "Full name is required.")
    private String fullName;

    @Email(message = "Invalid email format.")
    @NotBlank(message = "Email is required.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    private String password;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number.")
    private String phone;

    @NotNull(message = "Role is required.")
    private String role; // Use String for simplicity (replace with Enum if same Role enum is in Security Service)

    // Additional fields for doctor registration
    private String degreeNumber;
    private String specialization;
}
