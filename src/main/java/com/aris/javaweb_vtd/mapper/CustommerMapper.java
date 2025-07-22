package com.aris.javaweb_vtd.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.aris.javaweb_vtd.entity.Customer;

@Mapper
public interface CustommerMapper {
    void insertCustomer(Customer customer);
}
