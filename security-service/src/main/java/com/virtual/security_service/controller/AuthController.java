package com.virtual.security_service.controller;
import com.virtual.security_service.config.JwtTokenUtil;
import com.virtual.security_service.dto.RegisterDTO;
import com.virtual.security_service.dto.UserResponseDTO;
import com.virtual.security_service.service.UserServiceClient;
import com.virtual.security_service.model.JwtResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            String token = jwtTokenUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(new JwtResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }


    // Optional: Keep this if you want to handle registration in Security Service
    // Otherwise, you can remove it since registration will be handled by User Service
    @PostMapping("/register/patient")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registrationDTO) {
        // Delegate registration to User Service
        UserResponseDTO registeredUser = userServiceClient.registerUser(registrationDTO);
        return ResponseEntity.ok("User registered successfully with ID: " + registeredUser.getId());
    }

}