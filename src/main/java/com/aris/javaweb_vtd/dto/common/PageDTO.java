package com.aris.javaweb_vtd.dto.common;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageDTO<T> {
  private List<T> items;
  private int currentPage;
  private int totalPages;
  private int totalItems;
}