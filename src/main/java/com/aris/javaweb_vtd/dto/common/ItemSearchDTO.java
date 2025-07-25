package com.aris.javaweb_vtd.dto.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemSearchDTO {
  private String name;
  private String type;
  private Integer status;
  private String sortBy;
  private String sortOrder;
  private Integer page;
  private Integer size;
  private Integer offset;
}