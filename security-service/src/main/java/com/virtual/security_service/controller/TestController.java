package com.virtual.security_service.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/protected")
    public ResponseEntity<String> getProtectedResource() {
        return ResponseEntity.ok("This is a protected resource!");
    }

    @GetMapping("/public")
    public ResponseEntity<String> getPublicResource() {
        return ResponseEntity.ok("This is a public resource");
    }
}