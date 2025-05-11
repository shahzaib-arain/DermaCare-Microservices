package com.virtual.security_service.service;

import com.virtual.security_service.config.FeignClientConfig;
import com.virtual.security_service.dto.RegisterDTO;
import com.virtual.security_service.dto.UserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", configuration = FeignClientConfig.class)
public interface UserServiceClient {
    @PostMapping("/api/auth/validate")
    UserResponseDTO validateUser(@RequestParam String username, @RequestParam String password);

    @PostMapping("/api/auth/register/patient")
    UserResponseDTO registerUser(@RequestBody RegisterDTO registrationDTO);

    // For doctor registration
    @PostMapping("/api/auth/register/doctor")
    UserResponseDTO registerDoctor(@RequestBody RegisterDTO registrationDTO);

    // For admin registration
    @PostMapping("/api/auth/register/admin")
    UserResponseDTO registerAdmin(@RequestBody RegisterDTO registrationDTO);
}