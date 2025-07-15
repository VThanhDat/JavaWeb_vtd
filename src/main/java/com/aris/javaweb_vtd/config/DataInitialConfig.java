package com.aris.javaweb_vtd.config;

import java.time.LocalDateTime;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.aris.javaweb_vtd.dto.request.AdminRequestDTO;
import com.aris.javaweb_vtd.service.admin.AdminService;

@Configuration
public class DataInitialConfig {

    @Bean
    CommandLineRunner initAdmin(AdminService adminService, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!adminService.existsByUsername("admin")) {
                AdminRequestDTO admin = new AdminRequestDTO();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());
                adminService.insertAdmin(admin);
                System.out.println("Admin account created: admin / admin123");
            } else {
                System.out.println("Admin account already exists.");
            }
        };
    }
}