package com.virtual.user_service.repository;

import com.virtual.user_service.model.DoctorVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorVerificationRepository extends JpaRepository<DoctorVerification, Long> {
    Optional<DoctorVerification> findByUserId(String userId);

    @Query("SELECT dv FROM DoctorVerification dv JOIN FETCH dv.user WHERE dv.verified = false")
    List<DoctorVerification> findByVerifiedFalse();

    @Query("SELECT dv FROM DoctorVerification dv JOIN FETCH dv.user WHERE dv.verified = true")
    List<DoctorVerification> findByVerifiedTrue();
}