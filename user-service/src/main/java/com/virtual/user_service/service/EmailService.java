package com.virtual.user_service.service;

public interface EmailService {
    void sendWelcomeEmail(String toEmail, String name);
    void sendVerificationEmail(String toEmail, String name, String verificationToken);
    void sendPasswordResetEmail(String toEmail, String name, String resetToken);
}