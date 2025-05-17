package com.virtual.dermacare_service.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PrescriptionDTO {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime dateCreated;
    private String status; // PENDING, ACTIVE, COMPLETED, CANCELLED
    private List<PrescriptionItemDTO> items;
    private String patientName; // Added for client convenience
    private String doctorName; // Added for client convenience
}