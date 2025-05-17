package com.virtual.dermacare_service.repository;
import com.virtual.dermacare_service.model.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, Long> {

    List<Prescription> findByPatientId(Long patientId);

    List<Prescription> findByDoctorId(Long doctorId);

    List<Prescription> findByStatus(String status);

    List<Prescription> findByPatientIdAndStatus(Long patientId, String status);

    List<Prescription> findByDoctorIdAndStatus(Long doctorId, String status);

    List<Prescription> findByItems_Medicine_Id(Long medicineId);
}