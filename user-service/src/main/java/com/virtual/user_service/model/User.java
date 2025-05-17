package com.virtual.user_service.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "app_user")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String fullName;
    private String email;
    private String password;
    private String phone;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean verified;
    private boolean active = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    // For doctors
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.EAGER, optional = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DoctorVerification doctorVerification;
}
