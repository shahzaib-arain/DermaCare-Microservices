package com.virtual.dermacare_service.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;  // Changed from Long to String
    private String patientId;
    private String doctorId;
    private LocalDateTime appointmentTime;
    private Integer durationMinutes = 30;
    private String reason;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Appointment() {
        this.status = AppointmentStatus.BOOKED;
        this.createdAt = LocalDateTime.now();
    }
}