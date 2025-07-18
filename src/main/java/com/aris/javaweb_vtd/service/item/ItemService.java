package com.aris.javaweb_vtd.service.item;

import java.util.List;

import com.aris.javaweb_vtd.dto.request.ItemRequestDTO;
import com.aris.javaweb_vtd.dto.response.ItemResponseDTO;

public interface ItemService {
  void createItem(ItemRequestDTO itemRequestDTO);

  List<ItemResponseDTO> getItemsByType(String type);

  ItemResponseDTO getItemById(Long id);

  ItemResponseDTO updateItem(ItemRequestDTO itemRequestDTO);

  void deleteItem(Long id);

  List<ItemResponseDTO> getItemsByTypeAndStatus(String type);
}