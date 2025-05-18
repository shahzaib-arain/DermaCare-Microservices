package com.virtual.security_service.config;

import com.virtual.security_service.service.UserServiceClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtTokenUtil jwtTokenUtil;
   private final UserServiceClient userServiceClient;
    public SecurityConfig(JwtTokenUtil jwtTokenUtil, UserServiceClient userServiceClient) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userServiceClient = userServiceClient;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")  // Changed from hasRole
                        .requestMatchers("/api/doctor/**").hasAuthority("ROLE_DOCTOR")
                        .requestMatchers("/api/patient/**").hasAuthority("ROLE_PATIENT")// Changed from hasRole
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenUtil, userServiceClient),
                        UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }
}