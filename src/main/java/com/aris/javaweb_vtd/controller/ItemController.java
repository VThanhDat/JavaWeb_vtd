package com.aris.javaweb_vtd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aris.javaweb_vtd.dto.request.ItemRequestDTO;
import com.aris.javaweb_vtd.dto.response.ApiResponseDTO;
import com.aris.javaweb_vtd.service.item.ItemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/item")
public class ItemController {
  @Autowired
  private ItemService itemService;

  @PostMapping("/add")
  public ResponseEntity<ApiResponseDTO<String>> createItem(@ModelAttribute @Valid ItemRequestDTO dto) {
    try {
      if (dto.getImage() == null || dto.getImage().isEmpty()) {
        return ResponseEntity.badRequest().body(new ApiResponseDTO<>(false, "error", "Select one image"));
      }
      itemService.createItem(dto);
      return ResponseEntity.ok(new ApiResponseDTO<>(true, "success", "Successfully"));
    } catch (Exception e) {
      return ResponseEntity.badRequest()
          .body(new ApiResponseDTO<>(false, "error", "Create is failed"));
    }
  }
}
