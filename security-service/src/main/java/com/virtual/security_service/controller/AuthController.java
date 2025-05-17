package com.virtual.security_service.controller;

import com.virtual.security_service.config.JwtTokenUtil;
import com.virtual.security_service.dto.RegisterDTO;
import com.virtual.security_service.dto.UserResponseDTO;
import com.virtual.security_service.model.CustomUserDetails;
import com.virtual.security_service.model.JwtResponse;
import com.virtual.security_service.model.Role;
import com.virtual.security_service.service.UserServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final UserServiceClient userServiceClient;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public AuthController(UserServiceClient userServiceClient, JwtTokenUtil jwtTokenUtil) {
        this.userServiceClient = userServiceClient;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        try {
            UserResponseDTO user = userServiceClient.validateUser(username, password);

            // Using the String-role constructor
            CustomUserDetails userDetails = new CustomUserDetails(
                    user.getEmail(),
                    password,
                    "ROLE_" + user.getRole().name() // Just pass the role name as String
            );

            String token = jwtTokenUtil.generateToken(userDetails);
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/register/patient")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registrationDTO) {
        UserResponseDTO registeredUser = userServiceClient.registerUser(registrationDTO);
        return ResponseEntity.ok("Patient registered successfully with ID: " + registeredUser.getId());
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<String> registerDoctor(@RequestBody RegisterDTO registrationDTO) {
        UserResponseDTO registeredUser = userServiceClient.registerDoctor(registrationDTO);
        return ResponseEntity.ok("Doctor registered successfully with ID: " + registeredUser.getId());
    }
}