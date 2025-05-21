package com.virtual.dermacare_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DiagnosisDTO {
    private String id;  // Changed from Long to String
    private String patientId;
    private String doctorId;
    private String imageUrl;
    private String notes;
    private String diagnosis;
    private String recommendations;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime analyzedAt;
    private String patientName;
    private String doctorName;
}