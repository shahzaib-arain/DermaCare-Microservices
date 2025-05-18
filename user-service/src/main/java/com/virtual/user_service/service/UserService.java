package com.virtual.user_service.service;
import com.virtual.user_service.dto.RegisterDTO;
import com.virtual.user_service.dto.UserResponseDTO;
import com.virtual.user_service.model.DoctorVerification;
import com.virtual.user_service.model.Role;
import com.virtual.user_service.exception.UserNotFoundException;
import com.virtual.user_service.model.User;
import com.virtual.user_service.repository.DoctorVerificationRepository;
import com.virtual.user_service.repository.UserRepository;
import com.virtual.user_service.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final SecurityUtils securityUtils;
    private final EmailService emailService;
    private final DoctorVerificationRepository doctorVerificationRepository;

    @Transactional
    public UserResponseDTO registerUser(RegisterDTO registerDTO) {
        // Check if user exists
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Map and save user
        User user = modelMapper.map(registerDTO, User.class);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user = userRepository.save(user);

        // Handle doctor verification if needed
        if (user.getRole() == Role.DOCTOR) {
            DoctorVerification verification = new DoctorVerification();
            verification.setDegreeNumber(registerDTO.getDegreeNumber());
            verification.setSpecialization(registerDTO.getSpecialization());
            verification.setUser(user);
            verification.setVerified(false);
            doctorVerificationRepository.save(verification);
            user.setDoctorVerification(verification);
            user = userRepository.save(user); // Save again to update the relationship
        }

        // Create response DTO manually to avoid proxy issues
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setId(user.getId());
        responseDTO.setFullName(user.getFullName());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setPhone(user.getPhone());
        responseDTO.setRole(user.getRole());
        responseDTO.setVerified(user.isVerified());
        responseDTO.setCreatedAt(user.getCreatedAt());

        if (user.getRole() == Role.DOCTOR && user.getDoctorVerification() != null) {
            responseDTO.setDegreeNumber(user.getDoctorVerification().getDegreeNumber());
            responseDTO.setSpecialization(user.getDoctorVerification().getSpecialization());
            responseDTO.setDoctorVerified(user.getDoctorVerification().isVerified());
        }

        return responseDTO;
    }
    public UserResponseDTO getCurrentUser() {
        String email = securityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return convertToDto(user);
    }
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private UserResponseDTO convertToDto(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setVerified(user.isVerified());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getRole() == Role.DOCTOR && user.getDoctorVerification() != null) {
            DoctorVerification verification = user.getDoctorVerification();
            dto.setDegreeNumber(verification.getDegreeNumber());
            dto.setSpecialization(verification.getSpecialization());
            dto.setDoctorVerified(verification.isVerified());
        }

        return dto;
    }
}