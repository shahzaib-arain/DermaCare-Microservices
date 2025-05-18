package com.virtual.user_service.controller;

import com.virtual.user_service.dto.UserResponseDTO;
import com.virtual.user_service.model.Role;
import com.virtual.user_service.repository.DoctorVerificationRepository;
import com.virtual.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {
    private final UserService userService;
    private final DoctorVerificationRepository doctorVerificationRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getDoctorProfile() {
        // Spring Security will ensure only DOCTOR role can access this
        UserResponseDTO doctor = userService.getCurrentUser();

        // Additional check for doctor verification
        if (doctor.getRole() != Role.DOCTOR || !Boolean.TRUE.equals(doctor.isDoctorVerified())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(doctor);
    }

    // Other doctor-specific endpoints
}