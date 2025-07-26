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
    private List<String> status;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private String date;
    private String name;
    
    private Integer page;
    private Integer size;
}