package com.aris.javaweb_vtd.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.entity.Order;

@Mapper
public interface OrderMapper {
    void insertOrder(Order orderDTO);
}
