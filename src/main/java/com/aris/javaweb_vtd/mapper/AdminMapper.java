package com.aris.javaweb_vtd.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.dto.admin.request.AdminRequestDTO;

@Mapper
public interface AdminMapper {
  void insertAdmin(AdminRequestDTO adminRequestDTO);

  Optional<AdminRequestDTO> findByUsername(String username);

  void updatePassword(AdminRequestDTO adminRequestDTO);
}
