package com.virtual.user_service.controller;
import com.virtual.user_service.dto.RegisterDTO;
import com.virtual.user_service.dto.UserResponseDTO;
import com.virtual.user_service.model.Role;
import com.virtual.user_service.exception.BadCredentialsException;
import com.virtual.user_service.exception.UserNotFoundException;
import com.virtual.user_service.model.User;
import com.virtual.user_service.repository.UserRepository;
import com.virtual.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private  final UserRepository userRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @PostMapping("/register/patient")
    public ResponseEntity<UserResponseDTO> registerPatient(@RequestBody RegisterDTO registerDTO) {
        registerDTO.setRole(Role.PATIENT);
        return ResponseEntity.ok(userService.registerUser(registerDTO));
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<UserResponseDTO> registerDoctor(@RequestBody RegisterDTO registerDTO) {
        registerDTO.setRole(Role.DOCTOR);
        return ResponseEntity.ok(userService.registerUser(registerDTO));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<UserResponseDTO> registerAdmin(@RequestBody RegisterDTO registerDTO) {
        registerDTO.setRole(Role.ADMIN);
        return ResponseEntity.ok(userService.registerUser(registerDTO));
    }
    @PostMapping("/validate")
    public ResponseEntity<UserResponseDTO> validateUser(
            @RequestParam String username,
            @RequestParam String password) {

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // Create response DTO manually to ensure all fields are properly set
        UserResponseDTO responseDTO = new UserResponseDTO();
        responseDTO.setId(user.getId());
        responseDTO.setFullName(user.getFullName());
        responseDTO.setEmail(user.getEmail());
        responseDTO.setPhone(user.getPhone());
        responseDTO.setRole(user.getRole());
        responseDTO.setVerified(user.isVerified());

        if (user.getRole() == Role.DOCTOR && user.getDoctorVerification() != null) {
            responseDTO.setDegreeNumber(user.getDoctorVerification().getDegreeNumber());
            responseDTO.setSpecialization(user.getDoctorVerification().getSpecialization());
            responseDTO.setDoctorVerified(user.getDoctorVerification().isVerified());
        }

        return ResponseEntity.ok(responseDTO);
    }
    @GetMapping("/api/debug/principal")
    public ResponseEntity<?> debugPrincipal() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(authentication.getPrincipal());
    }
}
