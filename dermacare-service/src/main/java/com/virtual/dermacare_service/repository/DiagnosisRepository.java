package com.virtual.dermacare_service.repository;

import com.virtual.dermacare_service.model.Diagnosis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosisRepository extends MongoRepository<Diagnosis, String> {

    List<Diagnosis> findByPatientId(String patientId);

    List<Diagnosis> findByDoctorId(String doctorId);

    List<Diagnosis> findByStatus(String status);

    List<Diagnosis> findByPatientIdAndStatus(String patientId, String status);

    List<Diagnosis> findByDoctorIdAndStatus(String doctorId, String status);
}