package com.aris.javaweb_vtd.elasticsearch.repository;

import java.util.List;

import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;

public interface ItemSearchCustomRepository {
    PageDTO<ItemDocument> searchItems(ItemSearchDTO dto);

    List<String> autocompleteNames(String keyword);
}
