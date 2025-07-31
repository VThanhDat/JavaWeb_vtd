package com.aris.javaweb_vtd.elasticsearch.controller;

import com.aris.javaweb_vtd.dto.common.ApiResponseDTO;
import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;
import com.aris.javaweb_vtd.elasticsearch.service.ItemElasticService;
import com.aris.javaweb_vtd.service.item.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/search/item")
public class ItemSearchController {
  @Autowired
  private ItemElasticService itemSearchService;

  @Autowired
  private ItemService itemService;

  @GetMapping
  public ResponseEntity<ApiResponseDTO<PageDTO<ItemResponseDTO>>> searchItems(ItemSearchDTO searchDTO) {
    PageDTO<ItemResponseDTO> result = itemSearchService.searchItemsAsDTO(searchDTO);
    return ResponseEntity.ok(ApiResponseDTO.success(result));
  }

  @PostMapping("/sync-all")
  public ResponseEntity<ApiResponseDTO<String>> syncAllItemsToElasticsearch() {
    try {
      List<ItemResponseDTO> items = itemService.getAllItems();
      System.out.println(items);

      if (items.isEmpty()) {
        return ResponseEntity.ok(ApiResponseDTO.success("No items found in MySQL."));
      }

      items.forEach(itemSearchService::indexItem);

      return ResponseEntity.ok(
          ApiResponseDTO.success(items.size() + " items indexed to Elasticsearch."));
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
          ApiResponseDTO.error(e.getMessage()));
    }
  }

}
