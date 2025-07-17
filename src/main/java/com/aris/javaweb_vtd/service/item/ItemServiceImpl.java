package com.aris.javaweb_vtd.service.item;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aris.javaweb_vtd.dto.request.ItemRequestDTO;
import com.aris.javaweb_vtd.entity.Item;
import com.aris.javaweb_vtd.mapper.ItemMapper;
import com.aris.javaweb_vtd.util.FileUploadUtil;

@Service
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemMapper itemMapper;

    public void createItem(ItemRequestDTO dto) {
        String filename = null;
        try {
            filename = FileUploadUtil.saveImage(dto.getImage(), "uploads");
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to save image", e);
        }

        // DTO -> entity
        Item item = new Item();
        item.setName(dto.getName());
        item.setImage(filename);
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setType(dto.getType());
        if (dto.getStatus() != null) {
            item.setStatus(dto.getStatus());
        }
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());

        itemMapper.insertItem(item);
    }
}
