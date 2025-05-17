package com.virtual.dermacare_service.dto;

import com.virtual.dermacare_service.model.AppointmentStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private Integer durationMinutes;
    private String reason;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String patientName; // Added for client convenience
    private String doctorName; // Added for client convenience
}