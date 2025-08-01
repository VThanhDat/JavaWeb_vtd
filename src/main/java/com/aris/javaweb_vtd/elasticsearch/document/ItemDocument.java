package com.aris.javaweb_vtd.elasticsearch.document;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
// import org.springframework.data.elasticsearch.annotations.Mapping;
// import org.springframework.data.elasticsearch.annotations.Setting;

import java.time.LocalDateTime;

@Data
@Document(indexName = "items")
// @Setting(settingPath = "/elasticsearch/setting/item-setting.json")
// @Mapping(mappingPath = "/elasticsearch/mapping/item-mapping.json")
public class ItemDocument {
    @Id
    private Long id;
    // @Field(type = FieldType.Text, analyzer = "vietnamese_autocomplete_analyzer",
    // searchAnalyzer = "vietnamese_search_analyzer")
    private String name;
    private String description;
    @Field(type = FieldType.Text)
    private String image;
    private String type;
    private Double price;
    private Integer status;
    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second_millis)
    private LocalDateTime createdAt;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second_millis)
    private LocalDateTime updatedAt;
}
