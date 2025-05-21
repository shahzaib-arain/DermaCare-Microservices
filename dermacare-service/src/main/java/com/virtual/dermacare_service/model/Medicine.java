package com.virtual.dermacare_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "medicines")
public class Medicine {
    @Id
    private String id;  // Changed from Long to String
    private String name;
    private String description;
    private String manufacturer;
    private double price;
    private int stock;
}