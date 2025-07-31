package com.aris.javaweb_vtd.service.item;

import java.util.List;

import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.dto.item.request.ItemRequestDTO;
import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;

public interface ItemService {
  void createItem(ItemRequestDTO itemRequestDTO);

  List<ItemResponseDTO> getItemsByType(String type);

  ItemResponseDTO getItemById(Long id);

  ItemResponseDTO updateItem(ItemRequestDTO itemRequestDTO);

  void deleteItem(Long id);

  PageDTO<ItemResponseDTO> searchItemsWithPaging(ItemSearchDTO dto);

  List<ItemResponseDTO> getAllItems();
}