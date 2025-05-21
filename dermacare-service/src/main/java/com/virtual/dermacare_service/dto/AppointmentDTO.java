package com.virtual.dermacare_service.dto;

import com.virtual.dermacare_service.model.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private String id;  // Changed from Long to String
    private String patientId;
    private String doctorId;
    private LocalDateTime appointmentTime;
    private Integer durationMinutes;
    private String reason;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String patientName;
    private String doctorName;
}