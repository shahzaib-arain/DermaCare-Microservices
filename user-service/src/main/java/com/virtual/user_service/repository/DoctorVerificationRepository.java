package com.virtual.user_service.repository;

import com.virtual.user_service.model.DoctorVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorVerificationRepository extends JpaRepository<DoctorVerification, Long> {
    Optional<DoctorVerification> findByUserId(String userId);
    List<DoctorVerification> findByVerifiedFalse();
    List<DoctorVerification> findByVerifiedTrue();
}