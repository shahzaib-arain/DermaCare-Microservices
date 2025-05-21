package com.virtual.dermacare_service.impl;

import com.virtual.dermacare_service.dto.DiagnosisDTO;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;
import com.virtual.dermacare_service.model.Diagnosis;
import com.virtual.dermacare_service.repository.DiagnosisRepository;
import com.virtual.dermacare_service.service.DiagnosisService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiagnosisServiceImpl implements DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;
    private final ModelMapper modelMapper;

    @Override
    public DiagnosisDTO uploadImage(MultipartFile file, String notes) throws IOException {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getToken().getClaimAsString("sub");
        List<String> roles = authentication.getToken().getClaimAsStringList("roles");

        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setImage(file.getBytes());
        diagnosis.setNotes(notes);
        diagnosis.setStatus("PENDING");
        diagnosis.setPatientId(userId);

        Diagnosis savedDiagnosis = diagnosisRepository.save(diagnosis);
        return modelMapper.map(savedDiagnosis, DiagnosisDTO.class);
    }

    @Override
    public DiagnosisDTO getDiagnosis(String id) {
        Diagnosis diagnosis = diagnosisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));
        checkDiagnosisAccess(diagnosis);
        return modelMapper.map(diagnosis, DiagnosisDTO.class);
    }

    @Override
    public List<DiagnosisDTO> getDiagnosesByPatient(String patientId) {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getToken().getClaimAsString("sub");
        List<String> roles = authentication.getToken().getClaimAsStringList("roles");

        if (!userId.equals(patientId)) {
            boolean hasAccess = roles.stream()
                    .anyMatch(role -> role.equals("ROLE_DOCTOR") || role.equals("ROLE_ADMIN"));
            if (!hasAccess) {
                throw new UnauthorizedAccessException("You don't have permission to access these records");
            }
        }

        return diagnosisRepository.findByPatientId(patientId).stream()
                .map(d -> modelMapper.map(d, DiagnosisDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public DiagnosisDTO analyzeDiagnosis(String id, String diagnosisText, String recommendations) {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        List<String> roles = authentication.getToken().getClaimAsStringList("roles");
        String userId = authentication.getToken().getClaimAsString("sub");

        if (roles == null || !roles.contains("ROLE_DOCTOR")) {
            throw new UnauthorizedAccessException("Only doctors can analyze diagnoses");
        }

        Diagnosis diagnosis = diagnosisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));

        diagnosis.setDiagnosis(diagnosisText);
        diagnosis.setRecommendations(recommendations);
        diagnosis.setStatus("COMPLETED");
        diagnosis.setDoctorId(userId);

        Diagnosis savedDiagnosis = diagnosisRepository.save(diagnosis);
        return modelMapper.map(savedDiagnosis, DiagnosisDTO.class);
    }

    private void checkDiagnosisAccess(Diagnosis diagnosis) {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getToken().getClaimAsString("sub");
        List<String> roles = authentication.getToken().getClaimAsStringList("roles");

        if (!userId.equals(diagnosis.getPatientId())) {
            boolean hasAccess = roles.stream()
                    .anyMatch(role -> role.equals("ROLE_DOCTOR") || role.equals("ROLE_ADMIN"));
            if (!hasAccess) {
                throw new UnauthorizedAccessException("You don't have permission to access this record");
            }
        }
    }
}