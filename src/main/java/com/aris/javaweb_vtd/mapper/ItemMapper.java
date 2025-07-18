package com.aris.javaweb_vtd.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.entity.Item;

@Mapper
public interface ItemMapper {
  void insertItem(Item item);
}
