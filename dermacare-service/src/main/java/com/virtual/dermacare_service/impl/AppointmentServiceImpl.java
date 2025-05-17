package com.virtual.dermacare_service.impl;

import com.virtual.dermacare_service.dto.AppointmentDTO;
import com.virtual.dermacare_service.exception.AppointmentConflictException;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;
import com.virtual.dermacare_service.feignclient.UserServiceClient;
import com.virtual.dermacare_service.model.Appointment;
import com.virtual.dermacare_service.model.AppointmentStatus;
import com.virtual.dermacare_service.repository.AppointmentRepository;
import com.virtual.dermacare_service.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.virtual.dermacare_service.dto.UserResponseDTO;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public AppointmentDTO bookAppointment(AppointmentDTO appointmentDTO) {
        // Verify current user is a patient
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getRole().equals("PATIENT")) {
            throw new UnauthorizedAccessException("Only patients can book appointments");
        }

        // Check for conflicting appointments
        checkForConflicts(appointmentDTO.getDoctorId(), appointmentDTO.getAppointmentTime());

        Appointment appointment = modelMapper.map(appointmentDTO, Appointment.class);
        appointment.setPatientId(Long.valueOf(currentUser.getId()));
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setCreatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return modelMapper.map(savedAppointment, AppointmentDTO.class);
    }

    @Override
    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        // Verify current user has access to these records
        verifyAccessToPatientRecords(patientId);

        return appointmentRepository.findByPatientId(patientId).stream()
                .map(a -> modelMapper.map(a, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getDoctorAppointments(Long doctorId) {
        // Verify current user is the doctor or admin
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getId().equals(doctorId) && !currentUser.getRole().equals("ADMIN")) {
            throw new UnauthorizedAccessException("You can only view your own appointments");
        }

        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(a -> modelMapper.map(a, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentDTO rescheduleAppointment(Long id, String newDateTime) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        // Verify current user can modify this appointment
        verifyAppointmentModificationPermission(appointment);

        LocalDateTime newAppointmentTime = LocalDateTime.parse(newDateTime);

        // Check for conflicts with the new time
        checkForConflicts(appointment.getDoctorId(), newAppointmentTime);

        appointment.setAppointmentTime(newAppointmentTime);
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        appointment.setUpdatedAt(LocalDateTime.now());

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return modelMapper.map(updatedAppointment, AppointmentDTO.class);
    }

    @Override
    @Transactional
    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        // Verify current user can modify this appointment
        verifyAppointmentModificationPermission(appointment);

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }

    @Override
    public List<AppointmentDTO> getAvailableSlots(Long doctorId, String date) {
        // This would typically query the doctor's availability schedule
        // For now, we'll return all non-booked slots for the doctor on the given date
        LocalDateTime startDate = LocalDateTime.parse(date + "T00:00:00");
        LocalDateTime endDate = startDate.plusDays(1);

        return appointmentRepository.findByDoctorIdAndAppointmentTimeBetweenAndStatus(
                        doctorId, startDate, endDate, AppointmentStatus.AVAILABLE)
                .stream()
                .map(a -> modelMapper.map(a, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    private void checkForConflicts(Long doctorId, LocalDateTime appointmentTime) {
        LocalDateTime startTime = appointmentTime.minusMinutes(29);
        LocalDateTime endTime = appointmentTime.plusMinutes(29);

        boolean conflictExists = appointmentRepository.existsByDoctorIdAndAppointmentTimeBetweenAndStatusNot(
                doctorId, startTime, endTime, AppointmentStatus.CANCELLED);

        if (conflictExists) {
            throw new AppointmentConflictException("There is already an appointment scheduled at this time");
        }
    }

    private void verifyAccessToPatientRecords(Long patientId) {
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getId().equals(patientId) && !currentUser.getRole().equals("DOCTOR")
                && !currentUser.getRole().equals("ADMIN")) {
            throw new UnauthorizedAccessException("You don't have permission to access these records");
        }
    }

    private void verifyAppointmentModificationPermission(Appointment appointment) {
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        boolean isPatientOwner = currentUser.getId().equals(appointment.getPatientId());
        boolean isDoctorOwner = currentUser.getId().equals(appointment.getDoctorId());
        boolean isAdmin = currentUser.getRole().equals("ADMIN");

        if (!isPatientOwner && !isDoctorOwner && !isAdmin) {
            throw new UnauthorizedAccessException("You don't have permission to modify this appointment");
        }

        // Additional check if appointment is already cancelled
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new IllegalStateException("Cannot modify a cancelled appointment");
        }
    }
}