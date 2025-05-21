package com.virtual.dermacare_service.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PrescriptionDTO {
    private String id;  // Changed from Long to String
    private String patientId;
    private String doctorId;
    private LocalDateTime dateCreated;
    private String status;
    private List<PrescriptionItemDTO> items;
    private String patientName;
    private String doctorName;
}