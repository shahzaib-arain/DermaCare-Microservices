package com.virtual.dermacare_service.impl;

import com.virtual.dermacare_service.dto.AppointmentDTO;
import com.virtual.dermacare_service.exception.AppointmentConflictException;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public AppointmentDTO bookAppointment(AppointmentDTO appointmentDTO) {
        verifyUserIsPatient();
        checkForConflicts(appointmentDTO.getDoctorId(), appointmentDTO.getAppointmentTime());

        Appointment appointment = modelMapper.map(appointmentDTO, Appointment.class);
        appointment.setPatientId(getAuthenticatedUserId());
        appointment.setStatus(AppointmentStatus.BOOKED);
        appointment.setCreatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return modelMapper.map(savedAppointment, AppointmentDTO.class);
    }

    @Override
    public List<AppointmentDTO> getPatientAppointments(String patientId) {
        verifyAccessToPatientRecords(patientId);

        return appointmentRepository.findByPatientId(patientId).stream()
                .map(a -> modelMapper.map(a, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getDoctorAppointments(String doctorId) {
        verifyUserIsDoctorOrAdmin(doctorId);

        return appointmentRepository.findByDoctorId(doctorId).stream()
                .map(a -> modelMapper.map(a, AppointmentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentDTO rescheduleAppointment(String id, String newDateTime) {
        Appointment appointment = getExistingAppointment(id);
        verifyAppointmentModificationPermission(appointment);

        LocalDateTime newAppointmentTime = LocalDateTime.parse(newDateTime);
        checkForConflicts(appointment.getDoctorId(), newAppointmentTime);

        appointment.setAppointmentTime(newAppointmentTime);
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        appointment.setUpdatedAt(LocalDateTime.now());

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return modelMapper.map(updatedAppointment, AppointmentDTO.class);
    }

    @Override
    @Transactional
    public void cancelAppointment(String id) {
        Appointment appointment = getExistingAppointment(id);
        verifyAppointmentModificationPermission(appointment);

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }

    @Override
    public List<AppointmentDTO> getAvailableSlots(String doctorId, String date) {
        try {
            LocalDateTime startDate = LocalDateTime.parse(date + "T00:00:00");
            LocalDateTime endDate = startDate.plusDays(1);

            return appointmentRepository
                    .findByDoctorIdAndAppointmentTimeBetweenAndStatus(
                            doctorId, startDate, endDate, AppointmentStatus.AVAILABLE
                    )
                    .stream()
                    .map(a -> modelMapper.map(a, AppointmentDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Expected format: yyyy-MM-dd");
        }
    }


    private void verifyUserIsPatient() {
        String role = getAuthenticatedUserRole();
        if (!"ROLE_PATIENT".equals(role)) {
            throw new UnauthorizedAccessException("Only patients can book appointments");
        }
    }

    private void verifyUserIsDoctorOrAdmin(String doctorId) {
        String role = getAuthenticatedUserRole();
        String userId = getAuthenticatedUserId();

        if (!userId.equals(doctorId)) {
            if (!"ROLE_ADMIN".equals(role)) {
                throw new UnauthorizedAccessException("You can only view your own appointments");
            }
        }
    }

    private void verifyAccessToPatientRecords(String patientId) {
        String userId = getAuthenticatedUserId();
        String role = getAuthenticatedUserRole();

        if (!userId.equals(patientId)) {
            if (!"ROLE_DOCTOR".equals(role) && !"ROLE_ADMIN".equals(role)) {
                throw new UnauthorizedAccessException("You don't have permission to access these records");
            }
        }
    }

    private void verifyAppointmentModificationPermission(Appointment appointment) {
        String userId = getAuthenticatedUserId();
        String role = getAuthenticatedUserRole();

        if (!userId.equals(appointment.getPatientId()) && !userId.equals(appointment.getDoctorId())) {
            if (!"ROLE_ADMIN".equals(role)) {
                throw new UnauthorizedAccessException("You don't have permission to modify this appointment");
            }
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new IllegalStateException("Cannot modify a cancelled appointment");
        }
    }

    private Appointment getExistingAppointment(String id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
    }

    private void checkForConflicts(String doctorId, LocalDateTime appointmentTime) {
        LocalDateTime startTime = appointmentTime.minusMinutes(29);
        LocalDateTime endTime = appointmentTime.plusMinutes(29);

        boolean conflictExists = appointmentRepository.existsByDoctorIdAndAppointmentTimeBetweenAndStatusNot(
                doctorId, startTime, endTime, AppointmentStatus.CANCELLED);

        if (conflictExists) {
            throw new AppointmentConflictException("There is already an appointment scheduled at this time");
        }
    }

    private String getAuthenticatedUserId() {
        return ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
    }

    private String getAuthenticatedUserRole() {
        List<String> roles = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsStringList("roles");
        return roles != null && !roles.isEmpty() ? roles.get(0) : "";
    }
}