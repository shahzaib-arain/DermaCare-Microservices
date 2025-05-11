package com.virtual.user_service.service;


import com.virtual.user_service.dto.RegisterDTO;
import com.virtual.user_service.dto.UserResponseDTO;
import com.virtual.user_service.model.Role;
import com.virtual.user_service.exception.UserAlreadyExistsException;
import com.virtual.user_service.exception.UserNotFoundException;
import com.virtual.user_service.model.User;
import com.virtual.user_service.repository.UserRepository;
import com.virtual.user_service.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final SecurityUtils securityUtils;
    private final EmailService emailService;

    @Transactional
    public UserResponseDTO registerUser(RegisterDTO registerDTO) {
        if (userRepository.existsByEmail(registerDTO.getEmail())) {
            throw new UserAlreadyExistsException("Email already in use");
        }

        User user = modelMapper.map(registerDTO, User.class);
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        // Additional doctor-specific logic
        if (user.getRole() == Role.DOCTOR) {
            user.setVerified(false); // Doctors need verification
        } else {
            user.setVerified(true); // Others are auto-verified
        }

        User savedUser = userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName());

        return modelMapper.map(savedUser, UserResponseDTO.class);
    }

    public UserResponseDTO getCurrentUser() {
        String email = securityUtils.getCurrentUserEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        return modelMapper.map(user, UserResponseDTO.class);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> modelMapper.map(user, UserResponseDTO.class))
                .collect(Collectors.toList());
    }

    // Other methods for update, delete, etc.
}