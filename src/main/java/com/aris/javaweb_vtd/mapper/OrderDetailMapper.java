package com.aris.javaweb_vtd.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.entity.OrderDetail;

@Mapper
public interface OrderDetailMapper {
    void insertOrderDetail(OrderDetail detail);
}
