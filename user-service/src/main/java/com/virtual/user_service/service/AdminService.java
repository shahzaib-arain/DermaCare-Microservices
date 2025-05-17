package com.virtual.user_service.service;
import com.virtual.user_service.dto.DoctorVerificationDTO;
import com.virtual.user_service.exception.UserNotFoundException;
import com.virtual.user_service.model.DoctorVerification;
import com.virtual.user_service.model.Role;
import com.virtual.user_service.model.User;
import com.virtual.user_service.repository.DoctorVerificationRepository;
import com.virtual.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final DoctorVerificationRepository doctorVerificationRepository;
    private final UserRepository userRepository;

    public List<DoctorVerificationDTO> getPendingDoctorVerifications() {
        return doctorVerificationRepository.findByVerifiedFalse()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DoctorVerificationDTO> getVerifiedDoctors() {
        return doctorVerificationRepository.findByVerifiedTrue()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void verifyDoctor(String doctorId, String degreeFilePath) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new UserNotFoundException("Doctor not found"));

        if (doctor.getRole() != Role.DOCTOR) {
            throw new IllegalArgumentException("User is not a doctor");
        }

        DoctorVerification verification = doctorVerificationRepository.findByUserId(doctorId)
                .orElseThrow(() -> new IllegalStateException("Doctor verification record not found"));

        verification.setVerified(true);
        if (degreeFilePath != null) {
            verification.setDegreeFilePath(degreeFilePath);
        }
        doctorVerificationRepository.save(verification);
    }

    private DoctorVerificationDTO convertToDto(DoctorVerification verification) {
        User doctor = verification.getUser();
        return DoctorVerificationDTO.builder()
                .doctorId(doctor.getId())
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .degreeNumber(verification.getDegreeNumber())
                .specialization(verification.getSpecialization())
                .verified(verification.isVerified())
                .degreeFilePath(verification.getDegreeFilePath())
                .build();
    }
}