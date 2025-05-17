package com.virtual.dermacare_service.service;


import com.virtual.dermacare_service.dto.MedicineDTO;
import com.virtual.dermacare_service.dto.PrescriptionDTO;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;

import java.util.List;

public interface PharmacyService {
    PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO)
            throws UnauthorizedAccessException, ResourceNotFoundException;

    PrescriptionDTO getPrescription(Long id)
            throws ResourceNotFoundException, UnauthorizedAccessException;

    List<PrescriptionDTO> getPatientPrescriptions(Long patientId)
            throws UnauthorizedAccessException;

    String orderMedicines(Long prescriptionId)
            throws ResourceNotFoundException, UnauthorizedAccessException;

    List<MedicineDTO> getAllMedicines();
}