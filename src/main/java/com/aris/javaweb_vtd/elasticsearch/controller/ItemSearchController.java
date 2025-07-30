package com.aris.javaweb_vtd.elasticsearch.controller;

import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;
import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;
import com.aris.javaweb_vtd.elasticsearch.service.ItemSearchService;
import com.aris.javaweb_vtd.elasticsearch.repository.ItemSearchRepository;
import com.aris.javaweb_vtd.service.item.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search/items")
public class ItemSearchController {

    @Autowired
    private ItemSearchRepository itemSearchRepository;

    @Autowired
    private ItemSearchService itemSearchService;

    @Autowired
    private ItemService itemService; // Dùng nếu muốn sync 1 item từ DB lên ES

    // Tìm kiếm theo tên (match)
    @GetMapping
    public List<ItemDocument> searchItems(@RequestParam("keyword") String keyword) {
        return itemSearchRepository.findByNameContainingIgnoreCase(keyword);
    }

    // (Optional) Sync thủ công 1 Item từ DB lên Elasticsearch
    @PostMapping("/sync/{itemId}")
    public String syncItemToElasticsearch(@PathVariable Long itemId) {
        ItemResponseDTO itemDto = itemService.getItemById(itemId);
        if (itemDto != null) {
            // Chuyển đổi từ DTO sang Document để index vào ES
            itemSearchService.indexItem(itemDto);
            return "Item " + itemId + " indexed to Elasticsearch.";
        } else {
            return "Item not found in MySQL.";
        }
    }

}
