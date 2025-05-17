package com.virtual.dermacare_service.repository;
import com.virtual.dermacare_service.model.Diagnosis;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiagnosisRepository extends MongoRepository<Diagnosis, Long> {

    List<Diagnosis> findByPatientId(Long patientId);

    List<Diagnosis> findByDoctorId(Long doctorId);

    List<Diagnosis> findByStatus(String status);

    List<Diagnosis> findByPatientIdAndStatus(Long patientId, String status);

    List<Diagnosis> findByDoctorIdAndStatus(Long doctorId, String status);
}