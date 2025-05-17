package com.virtual.dermacare_service.dto;
import lombok.Data;

@Data
public class PrescriptionItemDTO {
    private Long medicineId;
    private String medicineName;
    private String dosage;
    private String duration;
    private String instructions;
}