package com.virtual.user_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DoctorVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String degreeFilePath;
    private boolean verified = false;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}