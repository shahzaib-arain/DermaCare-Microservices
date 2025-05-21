package com.virtual.user_service.controller;


import com.virtual.user_service.dto.DoctorVerificationDTO;
import com.virtual.user_service.dto.UserResponseDTO;
import com.virtual.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getPatientProfile() {
        return ResponseEntity.ok(userService.getCurrentUser());
    }
    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorVerificationDTO>> getAllDoctors() {
        return ResponseEntity.ok(userService.getAllVerifiedDoctors());
    }



}