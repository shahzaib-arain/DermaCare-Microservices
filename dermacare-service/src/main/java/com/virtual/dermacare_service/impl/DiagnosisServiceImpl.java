package com.virtual.dermacare_service.impl;
import com.virtual.dermacare_service.dto.DiagnosisDTO;
import com.virtual.dermacare_service.exception.ResourceNotFoundException;
import com.virtual.dermacare_service.exception.UnauthorizedAccessException;
import com.virtual.dermacare_service.feignclient.UserServiceClient;
import com.virtual.dermacare_service.model.Diagnosis;
import com.virtual.dermacare_service.repository.DiagnosisRepository;
import com.virtual.dermacare_service.service.DiagnosisService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.virtual.dermacare_service.dto.UserResponseDTO;


import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiagnosisServiceImpl implements DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;
    private final UserServiceClient userServiceClient;
    private final ModelMapper modelMapper;

    @Override
    public DiagnosisDTO uploadImage(MultipartFile file, String notes) throws IOException {
        Diagnosis diagnosis = new Diagnosis();
        diagnosis.setImage(file.getBytes());
        diagnosis.setNotes(notes);
        diagnosis.setStatus("PENDING");

        // Get current user from security context
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");

        // Validate user exists via User Service
        UserResponseDTO user = userServiceClient.validateUser(username, "");
        diagnosis.setPatientId(Long.valueOf(user.getId()));

        Diagnosis savedDiagnosis = diagnosisRepository.save(diagnosis);
        return modelMapper.map(savedDiagnosis, DiagnosisDTO.class);
    }

    @Override
    public DiagnosisDTO getDiagnosis(Long id) {
        Diagnosis diagnosis = diagnosisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));

        // Check if current user has access
        checkDiagnosisAccess(diagnosis);

        return modelMapper.map(diagnosis, DiagnosisDTO.class);
    }

    @Override
    public List<DiagnosisDTO> getDiagnosesByPatient(Long patientId) {
        // Verify current user has access to these records
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getId().equals(patientId) && !currentUser.getRole().equals("DOCTOR")
                && !currentUser.getRole().equals("ADMIN")) {
            throw new UnauthorizedAccessException("You don't have permission to access these records");
        }

        return diagnosisRepository.findByPatientId(patientId).stream()
                .map(d -> modelMapper.map(d, DiagnosisDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public DiagnosisDTO analyzeDiagnosis(Long id, String diagnosisText, String recommendations) {
        Diagnosis diagnosis = diagnosisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));

        // Verify current user is a doctor
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getRole().equals("DOCTOR")) {
            throw new UnauthorizedAccessException("Only doctors can analyze diagnoses");
        }

        diagnosis.setDiagnosis(diagnosisText);
        diagnosis.setRecommendations(recommendations);
        diagnosis.setStatus("COMPLETED");
        diagnosis.setDoctorId(Long.valueOf(currentUser.getId()));

        Diagnosis savedDiagnosis = diagnosisRepository.save(diagnosis);
        return modelMapper.map(savedDiagnosis, DiagnosisDTO.class);
    }

    private void checkDiagnosisAccess(Diagnosis diagnosis) {
        String username = ((JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication())
                .getToken().getClaimAsString("sub");
        UserResponseDTO currentUser = userServiceClient.validateUser(username, "");

        if (!currentUser.getId().equals(diagnosis.getPatientId())
                && !currentUser.getRole().equals("DOCTOR")
                && !currentUser.getRole().equals("ADMIN")) {
            throw new UnauthorizedAccessException("You don't have permission to access this record");
        }
    }
}