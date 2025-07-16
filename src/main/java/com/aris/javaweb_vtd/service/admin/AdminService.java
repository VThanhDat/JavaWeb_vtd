package com.aris.javaweb_vtd.service.admin;

import com.aris.javaweb_vtd.dto.request.AdminRequestDTO;
import com.aris.javaweb_vtd.dto.request.ChangePasswordRequestDTO;
import com.aris.javaweb_vtd.mapper.AdminMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Service
public class AdminService implements UserDetailsService {
    @Autowired
    private AdminMapper adminMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AdminRequestDTO admin = adminMapper.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User.builder()
                .username(admin.getUsername())
                .password(admin.getPassword())
                .authorities(getAuthorities(admin))
                .build();
    }

    private Collection<? extends GrantedAuthority> getAuthorities(AdminRequestDTO admin) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        return authorities;
    }

    @Transactional
    public void updatePassword(String username, ChangePasswordRequestDTO dto)
            throws UsernameNotFoundException {
        Optional<AdminRequestDTO> adminOpt = adminMapper.findByUsername(username);
        if (adminOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }

        AdminRequestDTO admin = adminOpt.get();

        if (!passwordEncoder.matches(dto.getCurrentPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (passwordEncoder.matches(dto.getNewPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }
        admin.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        admin.setUpdatedAt(LocalDateTime.now());
        adminMapper.updatePassword(admin);
    }

    public boolean existsByUsername(String username) {
        return adminMapper.findByUsername(username).isPresent();
    }

    public void insertAdmin(AdminRequestDTO adminRequestDTO) {
        adminRequestDTO.setPassword(passwordEncoder.encode(adminRequestDTO.getPassword()));
        adminRequestDTO.setCreatedAt(LocalDateTime.now());
        adminRequestDTO.setUpdatedAt(LocalDateTime.now());
        adminMapper.insertAdmin(adminRequestDTO);
    }

}
