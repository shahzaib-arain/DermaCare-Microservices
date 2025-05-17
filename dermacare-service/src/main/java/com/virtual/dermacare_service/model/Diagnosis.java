package com.virtual.dermacare_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "diagnoses")
public class Diagnosis {
    @Id
    private Long id;
    private Long patientId;
    private Long doctorId;
    private byte[] image;
    private String notes;
    private String diagnosis;
    private String recommendations;
    private String status; // PENDING, COMPLETED
    private LocalDateTime createdAt;
    private LocalDateTime analyzedAt;
}