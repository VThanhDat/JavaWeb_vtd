package com.aris.javaweb_vtd.service.item;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aris.javaweb_vtd.converter.ItemConverter;
import com.aris.javaweb_vtd.dto.request.ItemRequestDTO;
import com.aris.javaweb_vtd.entity.Item;
import com.aris.javaweb_vtd.mapper.ItemMapper;
import com.aris.javaweb_vtd.util.FileUploadUtil;

@Service
public class ItemServiceImpl implements ItemService {

  @Autowired
  private ItemMapper itemMapper;

  @Autowired
  private ItemConverter itemConverter;

  public void createItem(ItemRequestDTO dto) {
    String filename = null;
    try {
      filename = FileUploadUtil.saveImage(dto.getImage(), "uploads");
    } catch (java.io.IOException e) {
      throw new RuntimeException("Failed to save image", e);
    }

    // Converter DTO -> Entity
    Item item = itemConverter.toEntity(dto, filename);

    itemMapper.insertItem(item);
  }
}
