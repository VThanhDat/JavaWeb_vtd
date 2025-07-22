package com.aris.javaweb_vtd.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.dto.request.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.response.ItemResponseDTO;
import com.aris.javaweb_vtd.entity.Item;

@Mapper
public interface ItemMapper {

  void insertItem(Item item);

  boolean existsByNameAndType(String name, String type);

  List<ItemResponseDTO> getAllItemByType(String type);

  ItemResponseDTO getItemById(Long id);

  int updateItem(Item item);

  int updateStatusById(Long id, int status);

  List<ItemResponseDTO> getAllItemByTypeAndStatus(String type, Integer status);

  List<ItemResponseDTO> searchItemsForAdmin(ItemSearchDTO search);

  List<ItemResponseDTO> searchItemsForClient(ItemSearchDTO search);
}
