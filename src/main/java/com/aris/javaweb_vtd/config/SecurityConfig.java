package com.aris.javaweb_vtd.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.aris.javaweb_vtd.dto.common.ApiResponseDTO;
import com.aris.javaweb_vtd.service.admin.AdminService;
import com.fasterxml.jackson.databind.ObjectMapper;

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
            .requestMatchers(
                "/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html",
                "/swagger-resources/**",
                "/webjars/**")
            .permitAll()
            .requestMatchers("/admin/**").authenticated()
            .anyRequest().permitAll())
        .formLogin(form -> form
            .loginPage("/admin/login.html")
            .loginProcessingUrl("/admin/login")
            .failureUrl("/admin/login.html")
            .successHandler((request, response, authentication) -> {
              response.setStatus(HttpServletResponse.SC_OK);
              response.setContentType("application/json");
              response.getWriter().write(
                  new ObjectMapper().writeValueAsString(
                      new ApiResponseDTO<>(true, "success", "Successfully")));
            })
            .failureHandler((request, response, exception) -> {
              response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
              response.setContentType("application/json");
              response.getWriter().write(
                  new ObjectMapper().writeValueAsString(
                      new ApiResponseDTO<>(false, "error", "Your password or account is incorrectly")));
            })
            .permitAll())
        .logout(logout -> logout
            .logoutUrl("/admin/logout")
            .logoutSuccessHandler((request, response, authentication) -> {
              response.setStatus(HttpServletResponse.SC_OK);
              response.setContentType("application/json");
              response.getWriter().write(
                  new ObjectMapper().writeValueAsString(
                      new ApiResponseDTO<>(true, "success", "Logout successful")));
            })
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID")
            .permitAll())
        .userDetailsService(userDetailsService)
        .exceptionHandling(handling -> handling
            .authenticationEntryPoint((request, response, authException) -> {
              String acceptHeader = request.getHeader("Accept");
              if (acceptHeader != null && acceptHeader.contains("text/html")) {
                response.sendRedirect("/admin/login.html");
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
    AuthenticationManagerBuilder authenticationManagerBuilder = http
        .getSharedObject(AuthenticationManagerBuilder.class);
    authenticationManagerBuilder
        .userDetailsService(userDetailsService)
        .passwordEncoder(passwordEncoder);
    return authenticationManagerBuilder.build();
  }
}
