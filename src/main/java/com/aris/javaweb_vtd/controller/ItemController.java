package com.aris.javaweb_vtd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aris.javaweb_vtd.dto.request.ItemRequestDTO;
import com.aris.javaweb_vtd.dto.request.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.response.ApiResponseDTO;
import com.aris.javaweb_vtd.dto.response.ItemResponseDTO;
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
      itemService.createItem(dto);
      return ResponseEntity.ok(ApiResponseDTO.success("Successfully"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponseDTO.error(e.getMessage()));
    }
  }

  @GetMapping
  public ResponseEntity<ApiResponseDTO<List<ItemResponseDTO>>> getItemsByType(
      @RequestParam(required = false) String type) {
    return ResponseEntity.ok(ApiResponseDTO.success(itemService.getItemsByType(type)));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<ItemResponseDTO>> getItemById(@PathVariable Long id) {
    return ResponseEntity.ok(ApiResponseDTO.success(itemService.getItemById(id)));
  }

  @PostMapping("/update")
  public ResponseEntity<ApiResponseDTO<ItemResponseDTO>> updateItem(@ModelAttribute @Valid ItemRequestDTO dto) {
    return ResponseEntity.ok(ApiResponseDTO.success("Successful", itemService.updateItem(dto)));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<ApiResponseDTO<String>> softDeleteItem(@PathVariable Long id) {
    try {
      itemService.deleteItem(id);
      return ResponseEntity.ok(ApiResponseDTO.success("Successfull"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(ApiResponseDTO.error(e.getMessage()));
    }
  }

  @GetMapping("/status")
  public ResponseEntity<ApiResponseDTO<List<ItemResponseDTO>>> getItemsByTypeAndStatus(
      @RequestParam(required = false) String type) {
    return ResponseEntity.ok(ApiResponseDTO.success(itemService.getItemsByTypeAndStatus(type)));
  }

  @PostMapping("/searchClient")
  public ResponseEntity<ApiResponseDTO<List<ItemResponseDTO>>> searchItemsForClient(
      @RequestBody ItemSearchDTO searchDTO) {
    return ResponseEntity.ok(ApiResponseDTO.success("Successfull", itemService.searchItemsForClient(searchDTO)));
  }

  @PostMapping("/searchAdmin")
  public ResponseEntity<ApiResponseDTO<List<ItemResponseDTO>>> searchItemsForAdmin(
      @RequestBody ItemSearchDTO searchDTO) {
    return ResponseEntity.ok(ApiResponseDTO.success("Successfull", itemService.searchItemsForAdmin(searchDTO)));
  }
}
