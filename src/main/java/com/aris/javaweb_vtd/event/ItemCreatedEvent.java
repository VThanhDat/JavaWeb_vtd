package com.aris.javaweb_vtd.event;

import com.aris.javaweb_vtd.dto.item.response.ItemResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemCreatedEvent {
    ItemResponseDTO item;
}