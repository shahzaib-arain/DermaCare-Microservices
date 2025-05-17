package com.virtual.dermacare_service.controller;


import com.virtual.dermacare_service.dto.DiagnosisDTO;
import com.virtual.dermacare_service.service.DiagnosisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/diagnosis")
@RequiredArgsConstructor
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<DiagnosisDTO> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam String notes) throws IOException {
        return ResponseEntity.ok(diagnosisService.uploadImage(file, notes));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<DiagnosisDTO> getDiagnosis(@PathVariable Long id) {
        return ResponseEntity.ok(diagnosisService.getDiagnosis(id));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<DiagnosisDTO>> getDiagnosesByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(diagnosisService.getDiagnosesByPatient(patientId));
    }

    @PostMapping("/analyze/{id}")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<DiagnosisDTO> analyzeDiagnosis(
            @PathVariable Long id,
            @RequestParam String diagnosis,
            @RequestParam String recommendations) {
        return ResponseEntity.ok(diagnosisService.analyzeDiagnosis(id, diagnosis, recommendations));
    }
}