package com.aris.javaweb_vtd.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.aris.javaweb_vtd.dto.admin.request.AdminRequestDTO;
import com.aris.javaweb_vtd.service.admin.AdminService;

@Configuration
public class DataInitialConfig {

    @Bean
    CommandLineRunner initAdmin(AdminService adminService) {
        return args -> {
            if (!adminService.existsByUsername("admin")) {
                AdminRequestDTO admin = new AdminRequestDTO();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                adminService.insertAdmin(admin);
            } else {
                System.out.println("Admin account already exists.");
            }
        };
    }
}