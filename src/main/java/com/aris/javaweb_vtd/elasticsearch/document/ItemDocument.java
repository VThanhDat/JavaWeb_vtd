package com.aris.javaweb_vtd.elasticsearch.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;

import java.time.LocalDateTime;

@Data
@Document(indexName = "items")
public class ItemDocument {
    @Id
    private Long id;

    private String name;
    private String description;
    private String type;
    private Double price;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
