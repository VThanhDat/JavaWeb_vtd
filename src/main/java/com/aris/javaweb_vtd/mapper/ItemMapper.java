package com.aris.javaweb_vtd.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;
import com.aris.javaweb_vtd.entity.Item;

@Mapper
public interface ItemMapper {

  void insertItem(Item item);

  boolean existsByNameAndType(String name, String type);
  
  ItemResponseDTO getItemById(Long id);
  
  int updateItem(Item item);
  
  int updateStatusById(Long id, int status);

  List<ItemResponseDTO> getItemsWithFilters(ItemSearchDTO search);

  int countItemsWithFilters(ItemSearchDTO dto);
}
