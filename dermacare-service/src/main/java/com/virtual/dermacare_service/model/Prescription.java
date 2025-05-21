package com.virtual.dermacare_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "prescriptions")
public class Prescription {
    @Id
    private String id;  // Changed from Long to String
    private String patientId;
    private String doctorId;
    private LocalDateTime dateCreated;
    private String status; // PENDING, ACTIVE, COMPLETED, CANCELLED
    private List<PrescriptionItem> items;
}