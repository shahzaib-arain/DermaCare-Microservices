package com.virtual.dermacare_service.model;


import lombok.Data;

@Data
public class PrescriptionItem {
    private Medicine medicine;
    private String dosage;
    private String duration;
    private String instructions;
}