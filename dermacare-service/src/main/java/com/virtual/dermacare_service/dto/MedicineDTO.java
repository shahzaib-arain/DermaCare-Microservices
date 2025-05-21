package com.virtual.dermacare_service.dto;

import lombok.Data;

@Data
public class MedicineDTO {
    private String id;  // Changed from Long to String
    private String name;
    private String description;
    private String manufacturer;
    private double price;
    private int stock;
    private String category;
    private String dosageForm;
}