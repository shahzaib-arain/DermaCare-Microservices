package com.virtual.dermacare_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "appointments")
public class Appointment {
    @Id
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private Integer durationMinutes; // Default 30 minutes
    private String reason;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Appointment() {
        this.durationMinutes = 30; // Default duration
        this.status = AppointmentStatus.BOOKED;
        this.createdAt = LocalDateTime.now();
    }
}