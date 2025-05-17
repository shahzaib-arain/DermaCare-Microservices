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
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime dateCreated;
    private String status; // PENDING, ACTIVE, COMPLETED, CANCELLED
    private List<PrescriptionItem> items;
}