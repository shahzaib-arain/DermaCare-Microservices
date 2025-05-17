package com.virtual.dermacare_service.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DiagnosisDTO {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String imageUrl; // In practice, you might store a URL or reference instead of the actual image
    private String notes;
    private String diagnosis;
    private String recommendations;
    private String status; // PENDING, COMPLETED
    private LocalDateTime createdAt;
    private LocalDateTime analyzedAt;
    private String patientName; // Added for client convenience
    private String doctorName; // Added for client convenience
}