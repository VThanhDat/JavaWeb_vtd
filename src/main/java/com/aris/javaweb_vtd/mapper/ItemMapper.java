package com.aris.javaweb_vtd.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.dto.response.ItemResponseDTO;

@Mapper
public interface ItemMapper {

  void insertItem(ItemResponseDTO item);

  boolean existsByNameAndType(String name, String type);

  List<ItemResponseDTO> getAllItemByType(String type);

  ItemResponseDTO getItemById(Long id);

  int updateItem(ItemResponseDTO item);

  int updateStatusById(Long id, int status);

  List<ItemResponseDTO> getAllItemByTypeAndStatus(String type, Integer status);
}
