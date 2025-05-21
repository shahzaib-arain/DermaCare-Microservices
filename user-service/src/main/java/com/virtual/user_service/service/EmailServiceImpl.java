package com.virtual.user_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Async
    @Override
    public void sendWelcomeEmail(String toEmail, String name) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            Context context = new Context(Locale.getDefault());
            context.setVariable("name", name);

            // Correct template path - should match your actual template file location
            String htmlContent = templateEngine.process("email/welcome-email.html", context);

            helper.setText(htmlContent, true);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to Virtual Derma");
            helper.setFrom(fromEmail);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    @Async
    @Override
    public void sendVerificationEmail(String toEmail, String name, String verificationToken) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            Context context = new Context(Locale.getDefault());
            context.setVariable("name", name);
            context.setVariable("verificationUrl", baseUrl + "/api/auth/verify?token=" + verificationToken);

            String htmlContent = templateEngine.process("email/verify-email", context);

            helper.setText(htmlContent, true);
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Email Address");
            helper.setFrom(fromEmail);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    @Async
    @Override
    public void sendPasswordResetEmail(String toEmail, String name, String resetToken) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            Context context = new Context(Locale.getDefault());
            context.setVariable("name", name);
            context.setVariable("resetUrl", baseUrl + "/api/auth/reset-password?token=" + resetToken);

            String htmlContent = templateEngine.process("email/reset-password", context);

            helper.setText(htmlContent, true);
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request");
            helper.setFrom(fromEmail);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }
}
