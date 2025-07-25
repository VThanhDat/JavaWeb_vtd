package com.aris.javaweb_vtd.service.item;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aris.javaweb_vtd.converter.ItemConverter;
import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.dto.item.request.ItemRequestDTO;
import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;
import com.aris.javaweb_vtd.entity.Item;
import com.aris.javaweb_vtd.mapper.ItemMapper;
import com.aris.javaweb_vtd.util.FileUploadUtil;

@Service
public class ItemServiceImpl implements ItemService {

  @Autowired
  private ItemMapper itemMapper;

  @Autowired
  private ItemConverter itemConverter;

  @Transactional
  public void createItem(ItemRequestDTO dto) {
    String filename = null;
    String folder = null;
    boolean isDuplicate = itemMapper.existsByNameAndType(dto.getName(), dto.getType());
    if (isDuplicate) {
      throw new IllegalArgumentException("A item already exists with this name and type.");
    }

    if (dto.getImage() == null || dto.getImage().isEmpty()) {
      throw new IllegalArgumentException("Select one image");
    }

    try {
      folder = dto.getType().equalsIgnoreCase("food") ? "uploads/food" : "uploads/drink";
      String saveName = FileUploadUtil.saveImage(dto.getImage(), folder);
      filename = folder + "/" + saveName;

      Item item = itemConverter.toEntity(dto, filename);
      itemMapper.insertItem(item);
    } catch (Exception e) {
      if (filename != null && folder != null) {
        String savedName = filename.substring(filename.lastIndexOf('/') + 1);
        FileUploadUtil.deleteImage(folder, savedName);
      }
      throw new RuntimeException("Create is failed", e);
    }
  }

  @Override
  public ItemResponseDTO getItemById(Long id) {
    ItemResponseDTO item = itemMapper.getItemById(id);
    if (item == null) {
      throw new IllegalArgumentException("No items found with ID is " + id);
    }
    return item;
  }

  @Override
  public ItemResponseDTO updateItem(ItemRequestDTO dto) {
    ItemResponseDTO currentItem = itemMapper.getItemById(dto.getId());
    if (currentItem == null) {
      throw new IllegalArgumentException("No items found with ID is " + dto.getId());
    }

    boolean isNameChanged = !dto.getName().equalsIgnoreCase(currentItem.getName());
    boolean isTypeChanged = !dto.getType().equalsIgnoreCase(currentItem.getType());

    if (isNameChanged || isTypeChanged) {
      boolean isDuplicate = itemMapper.existsByNameAndType(dto.getName(), dto.getType());
      if (isDuplicate) {
        throw new IllegalArgumentException("An item already exists with this name and type.");
      }
    }

    String newFilename = currentItem.getImage();
    boolean isNewImageUploaded = false;
    String folder = null;

    try {
      if (dto.getImage() != null && !dto.getImage().isEmpty()) {
        folder = dto.getType().equalsIgnoreCase("food") ? "uploads/food" : "uploads/drink";
        String savedName = FileUploadUtil.saveImage(dto.getImage(), folder);
        newFilename = folder + "/" + savedName;
        isNewImageUploaded = true;
      }

      Item item = itemConverter.toEntity(dto, newFilename);
      int updateItem = itemMapper.updateItem(item);

      if (updateItem == 0) {
        throw new IllegalArgumentException("Update failed. No item found with ID is " + dto.getId());
      }

      if (isNewImageUploaded && !newFilename.equals(currentItem.getImage())) {
        String oldFolder = currentItem.getImage().substring(0, currentItem.getImage().lastIndexOf('/'));
        String oldFilename = currentItem.getImage().substring(currentItem.getImage().lastIndexOf('/') + 1);
        FileUploadUtil.deleteImage(oldFolder, oldFilename);
      }

      return itemMapper.getItemById(dto.getId());

    } catch (Exception e) {
      if (isNewImageUploaded && !newFilename.equals(currentItem.getImage())) {
        String savedName = newFilename.substring(newFilename.lastIndexOf('/') + 1);
        FileUploadUtil.deleteImage(folder, savedName);
      }
      throw new RuntimeException("Update failed", e);
    }
  }

  @Override
  public void deleteItem(Long id) {
    ItemResponseDTO item = itemMapper.getItemById(id);
    if (item == null) {
      throw new IllegalArgumentException("Item with ID " + id + " not found");
    }

    int result = itemMapper.updateStatusById(id, 0);
    if (result == 0) {
      throw new IllegalArgumentException("Delete failed");
    }
  }

  @Override
  public List<ItemResponseDTO> getItemsByType(String type) {
      ItemSearchDTO searchDTO = new ItemSearchDTO();
      searchDTO.setType(type);
      
      List<ItemResponseDTO> items = itemMapper.getItemsWithFilters(searchDTO);
      if (items == null || items.isEmpty()) {
          throw new IllegalArgumentException("No items found with type is " + type);
      }
      return items;
  }

  @Override
  public PageDTO<ItemResponseDTO> searchItemsWithPaging(ItemSearchDTO dto) {
    if (dto.getPage() != null && dto.getSize() != null) {
        dto.setOffset((dto.getPage() - 1) * dto.getSize());
    }

    List<ItemResponseDTO> items = itemMapper.getItemsWithFilters(dto);
    int total = itemMapper.countItemsWithFilters(dto);

    int totalPages = (int) Math.ceil((double) total / dto.getSize());

    return new PageDTO<>(items, dto.getPage(), totalPages, total);
  }

}
