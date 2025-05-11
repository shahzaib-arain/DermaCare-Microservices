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
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private  final UserRepository userRepository;
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

        return ResponseEntity.ok(modelMapper.map(user, UserResponseDTO.class));
    }
}
