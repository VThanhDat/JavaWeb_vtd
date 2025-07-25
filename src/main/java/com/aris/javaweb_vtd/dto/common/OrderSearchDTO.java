package com.aris.javaweb_vtd.dto.common;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSearchDTO {
    private List<String> statusList;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private String dateFilter;
    private String searchName;
    
    private Integer page;
    private Integer size;
}