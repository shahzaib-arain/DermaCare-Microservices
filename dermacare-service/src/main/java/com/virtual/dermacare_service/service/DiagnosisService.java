package com.virtual.dermacare_service.service;

import com.virtual.dermacare_service.dto.DiagnosisDTO;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface DiagnosisService {
    DiagnosisDTO uploadImage(MultipartFile file, String notes)
            throws IOException, UnauthorizedAccessException;

    DiagnosisDTO getDiagnosis(String id)
            throws ResourceNotFoundException, UnauthorizedAccessException;

    List<DiagnosisDTO> getDiagnosesByPatient(String patientId)
            throws UnauthorizedAccessException;

    DiagnosisDTO analyzeDiagnosis(String id, String diagnosisText, String recommendations)
            throws ResourceNotFoundException, UnauthorizedAccessException;
}