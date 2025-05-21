package com.virtual.dermacare_service.service;

import com.virtual.dermacare_service.dto.AppointmentDTO;
import com.virtual.dermacare_service.exception.AppointmentConflictException;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;

import java.util.List;

public interface AppointmentService {
    AppointmentDTO bookAppointment(AppointmentDTO appointmentDTO)
            throws UnauthorizedAccessException, AppointmentConflictException;

    List<AppointmentDTO> getPatientAppointments(String patientId)
            throws UnauthorizedAccessException;

    List<AppointmentDTO> getDoctorAppointments(String doctorId)
            throws UnauthorizedAccessException;

    AppointmentDTO rescheduleAppointment(String id, String newDateTime)
            throws ResourceNotFoundException, UnauthorizedAccessException, AppointmentConflictException;

    void cancelAppointment(String id)
            throws ResourceNotFoundException, UnauthorizedAccessException;

    List<AppointmentDTO> getAvailableSlots(String doctorId, String date);
}