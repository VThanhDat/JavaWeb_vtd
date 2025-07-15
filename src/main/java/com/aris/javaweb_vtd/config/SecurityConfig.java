package com.aris.javaweb_vtd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.aris.javaweb_vtd.service.admin.AdminService;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

  @Autowired
  private AdminService userDetailsService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Bean
  SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .httpBasic(Customizer.withDefaults())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/login", "/js/**", "/css/**", "/img/**").permitAll()
            .requestMatchers("/admin/**").authenticated()
            .anyRequest().authenticated())
        .formLogin(form -> form
            .loginPage("/admin/login.html")
            .loginProcessingUrl("/admin/login")
            .failureUrl("/admin/login.html?error=true")
            .successHandler((request, response, authentication) -> {
              response.setStatus(HttpServletResponse.SC_OK);
              response.setContentType("application/json");
              response.getWriter().write("{\"message\": \"Login successful\"}");
            })
            .failureHandler((request, response, exception) -> {
              response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
              response.setContentType("application/json");
              response.getWriter().write("{\"error\": \"Wrong user name or password\"}");
            })
            .permitAll())
        .userDetailsService(userDetailsService)
        .exceptionHandling(handling -> handling
            .authenticationEntryPoint((request, response, authException) -> {
              String acceptHeader = request.getHeader("Accept");
              if (acceptHeader != null && acceptHeader.contains("text/html")) {
                response.sendRedirect("/login.html");
              } else {
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\": \"Unauthorized\"}");
              }
            }));
    return http.build();
  }

  @Bean
  AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
    return http.getSharedObject(AuthenticationManagerBuilder.class)
        .userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder)
        .and()
        .build();
  }
}
