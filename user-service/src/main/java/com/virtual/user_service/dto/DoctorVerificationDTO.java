package com.virtual.user_service.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorVerificationDTO {
    private String doctorId;
    private String fullName;
    private String email;
    private String phone;
    private String degreeNumber;
    private String specialization;
    private boolean verified;
    private String degreeFilePath;
}
