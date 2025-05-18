package com.virtual.security_service.controller;

import com.virtual.security_service.config.JwtTokenUtil;
import com.virtual.security_service.dto.RegisterDTO;
import com.virtual.security_service.dto.UserResponseDTO;
import com.virtual.security_service.model.CustomUserDetails;
import com.virtual.security_service.model.JwtResponse;
import com.virtual.security_service.model.Role;
import com.virtual.security_service.service.UserServiceClient;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

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
            System.out.println("Login attempt for: " + username); // Debug log

            // 1. Validate user credentials
            UserResponseDTO user = userServiceClient.validateUser(username, password);
            System.out.println("User validation response: " + (user != null ? user.getEmail() : "null")); // Debug log

            if (user == null) {
                System.out.println("Invalid credentials for: " + username); // Debug log
                return ResponseEntity.status(401).body("Invalid credentials");
            }

            // 2. Create authorities
            List<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
            );
            System.out.println("Authorities: " + authorities); // Debug log

            // 3. Create UserDetails
            // Pass doctor verification status
            boolean isDoctorVerified = user.getRole() == Role.DOCTOR &&  Boolean.TRUE.equals(user.getDoctorVerified());
            CustomUserDetails userDetails = new CustomUserDetails(
                    user.getEmail(),
                    authorities,
                    isDoctorVerified
            );
            // 4. Generate token
            String token = jwtTokenUtil.generateToken(userDetails);
            System.out.println("Generated token: " + token); // Debug log

            return ResponseEntity.ok(new JwtResponse(token));

        } catch (Exception e) {
            System.out.println("Login error: " + e.getMessage()); // Debug log
            e.printStackTrace();
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

    @GetMapping("/debug/token")
    public ResponseEntity<?> debugToken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // Remove "Bearer "
        Claims claims = jwtTokenUtil.getClaimsFromToken(token);
        return ResponseEntity.ok(claims);
    }
}