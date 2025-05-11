package com.virtual.user_service.dto;

import com.virtual.user_service.model.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

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
    private Role role;

    // Additional fields for doctor registration
    private String degreeNumber;
    private String specialization;

    public void setRole(Role role) {
        this.role = role;
    }
}
