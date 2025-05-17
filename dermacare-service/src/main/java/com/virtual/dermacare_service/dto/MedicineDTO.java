package com.virtual.dermacare_service.dto;

import lombok.Data;

@Data
public class MedicineDTO {
    private Long id;
    private String name;
    private String description;
    private String manufacturer;
    private double price;
    private int stock;
    private String category; // Optional: e.g., "antibiotic", "pain reliever"
    private String dosageForm; // Optional: e.g., "tablet", "capsule", "syrup"
}