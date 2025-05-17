package com.virtual.dermacare_service.feignclient;


import com.virtual.dermacare_service.dto.UserResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service", url = "${user.service.url}")
public interface UserServiceClient {

    @GetMapping("/api/users/me")
    UserResponseDTO getCurrentUser(@RequestHeader("Authorization") String token);

    @GetMapping("/api/auth/validate")
    UserResponseDTO validateUser(
            @RequestParam String username,
            @RequestParam String password);
}