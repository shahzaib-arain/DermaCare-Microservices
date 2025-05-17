package com.virtual.user_service.controller;
import com.virtual.user_service.dto.DoctorVerificationDTO;
import com.virtual.user_service.model.DoctorVerification;
import com.virtual.user_service.repository.DoctorVerificationRepository;
import com.virtual.user_service.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;
    private final DoctorVerificationRepository doctorVerificationRepository;

    @GetMapping("/doctors/pending")
    public ResponseEntity<List<DoctorVerificationDTO>> getPendingVerifications() {
        return ResponseEntity.ok(adminService.getPendingDoctorVerifications());
    }

    @PutMapping("/doctors/verify/{doctorId}")
    public ResponseEntity<String> verifyDoctor(
            @PathVariable String doctorId,
            @RequestParam(required = false) String degreeFilePath) {
        adminService.verifyDoctor(doctorId, degreeFilePath);
        return ResponseEntity.ok("Doctor verified successfully");
    }

    @GetMapping("/doctors/verified")
    public ResponseEntity<List<DoctorVerificationDTO>> getVerifiedDoctors() {
        return ResponseEntity.ok(adminService.getVerifiedDoctors());
    }
}