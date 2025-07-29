package com.aris.javaweb_vtd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aris.javaweb_vtd.dto.common.ApiResponseDTO;
import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.dto.item.request.ItemRequestDTO;
import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;
import com.aris.javaweb_vtd.service.item.ItemService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/item")
public class ItemController {
  @Autowired
  private ItemService itemService;

  @Operation(summary = "Create item")
  @PostMapping("/add")
  public ResponseEntity<ApiResponseDTO<String>> createItem(@ModelAttribute @Valid ItemRequestDTO dto) {
    try {
      itemService.createItem(dto);
      return ResponseEntity.ok(ApiResponseDTO.success("Successfully"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponseDTO.error(e.getMessage()));
    }
  }

  @Operation(summary = "Get item by id")
  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<ItemResponseDTO>> getItemById(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponseDTO.success(itemService.getItemById(id)));
  }

  @Operation(summary = "Update item")
  @PostMapping("/update")
  public ResponseEntity<ApiResponseDTO<ItemResponseDTO>> updateItem(@ModelAttribute @Valid ItemRequestDTO dto) {
    return ResponseEntity.ok(ApiResponseDTO.success("Successful", itemService.updateItem(dto)));
  }

  @Operation(summary = "Delete item")
  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<String>> softDeleteItem(@PathVariable Long id) {
    try {
      itemService.deleteItem(id);
      return ResponseEntity.ok(ApiResponseDTO.success("Successfull"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponseDTO.error(e.getMessage()));
    }
  }

  @Operation(summary = "Get all items")
  @GetMapping
  public ResponseEntity<ApiResponseDTO<PageDTO<ItemResponseDTO>>> getItems(ItemSearchDTO dto) {
    PageDTO<ItemResponseDTO> page = itemService.searchItemsWithPaging(dto);
    return ResponseEntity.ok(ApiResponseDTO.success(page));
  }
}
