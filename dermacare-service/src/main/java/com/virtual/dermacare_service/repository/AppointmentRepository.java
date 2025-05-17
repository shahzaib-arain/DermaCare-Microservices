package com.virtual.dermacare_service.repository;
import com.virtual.dermacare_service.model.Appointment;
import com.virtual.dermacare_service.model.AppointmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByDoctorIdAndAppointmentTimeBetweenAndStatus(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end,
            AppointmentStatus status
    );

    boolean existsByDoctorIdAndAppointmentTimeBetweenAndStatusNot(
            Long doctorId,
            LocalDateTime start,
            LocalDateTime end,
            AppointmentStatus status
    );

    List<Appointment> findByStatusAndAppointmentTimeBefore(
            AppointmentStatus status,
            LocalDateTime dateTime
    );
}