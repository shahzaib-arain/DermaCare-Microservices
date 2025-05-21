package com.virtual.dermacare_service.controller;

import com.virtual.dermacare_service.dto.AppointmentDTO;
import com.virtual.dermacare_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")
    public ResponseEntity<AppointmentDTO> bookAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        return ResponseEntity.ok(appointmentService.bookAppointment(appointmentDTO));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_DOCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<List<AppointmentDTO>> getPatientAppointments(@PathVariable String patientId) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyAuthority('ROLE_DOCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<List<AppointmentDTO>> getDoctorAppointments(@PathVariable String doctorId) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(doctorId));
    }

    @PutMapping("/{id}/reschedule")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_DOCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<AppointmentDTO> rescheduleAppointment(
            @PathVariable String id,
            @RequestParam String newDateTime) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, newDateTime));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_DOCTOR', 'ROLE_ADMIN')")
    public ResponseEntity<Void> cancelAppointment(@PathVariable String id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available/{doctorId}")
    public ResponseEntity<List<AppointmentDTO>> getAvailableSlots(
            @PathVariable String doctorId,
            @RequestParam String date) {

        List<AppointmentDTO> slots = appointmentService.getAvailableSlots(doctorId, date);
        return ResponseEntity.ok(slots);
    }

}