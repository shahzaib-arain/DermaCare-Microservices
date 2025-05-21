package com.virtual.dermacare_service.repository;

import com.virtual.dermacare_service.model.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {

    List<Prescription> findByPatientId(String patientId);

    List<Prescription> findByDoctorId(String doctorId);

    List<Prescription> findByStatus(String status);

    List<Prescription> findByPatientIdAndStatus(String patientId, String status);

    List<Prescription> findByDoctorIdAndStatus(String doctorId, String status);

    List<Prescription> findByItems_Medicine_Id(String medicineId);
}