package com.aris.javaweb_vtd.elasticsearch.repository;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.TextQueryType;
import co.elastic.clients.elasticsearch._types.query_dsl.Operator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Repository;

import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;

@Slf4j
@Repository
@RequiredArgsConstructor
public class ItemSearchCustomRepositoryImpl implements ItemSearchCustomRepository {

  private final ElasticsearchTemplate elasticsearchTemplate;

  @Override
  public PageDTO<ItemDocument> searchItems(ItemSearchDTO dto) {
    BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();

    if (dto.getName() != null && !dto.getName().isBlank()) {
      boolQueryBuilder.must(m -> m
          .multiMatch(mm -> mm
              .query(dto.getName().trim())
              .fields("name", "name.standard")
              .type(TextQueryType.BestFields)
              .operator(Operator.And)));

    }

    if (dto.getType() != null && !dto.getType().isBlank()) {
      boolQueryBuilder.filter(TermQuery.of(t -> t
          .field("type")
          .value(dto.getType()))._toQuery());
    }

    if (dto.getStatus() != null) {
      boolQueryBuilder.filter(TermQuery.of(t -> t
          .field("status")
          .value(dto.getStatus()))._toQuery());
    }

    String sortField = dto.getSortBy() != null ? dto.getSortBy() : "createdAt";
    SortOrder sortOrder = "DESC".equalsIgnoreCase(dto.getSortOrder()) ? SortOrder.Desc : SortOrder.Asc;

    int page = dto.getPage() != null && dto.getPage() > 0 ? dto.getPage() - 1 : 0;
    int size = dto.getSize() != null ? dto.getSize() : 10;
    Pageable pageable = PageRequest.of(page, size);

    NativeQuery searchQuery = NativeQuery.builder()
        .withQuery(boolQueryBuilder.build()._toQuery())
        .withSort(co.elastic.clients.elasticsearch._types.SortOptions.of(s -> s
            .field(f -> f
                .field(sortField)
                .order(sortOrder))))
        .withPageable(pageable)
        .withTrackTotalHits(true)
        .build();

    SearchHits<ItemDocument> searchHits = elasticsearchTemplate.search(searchQuery, ItemDocument.class);

    List<ItemDocument> documents = searchHits.stream()
        .map(hit -> hit.getContent())
        .toList();

    long totalItems = searchHits.getTotalHits();
    int totalPages = (int) Math.ceil((double) totalItems / pageable.getPageSize());

    return new PageDTO<>(
        documents,
        pageable.getPageNumber() + 1,
        (int) totalItems,
        totalPages);
  }

  @Override
  public List<String> autocompleteNames(String keyword) {
    if (keyword == null || keyword.isBlank())
      return List.of();

    NativeQuery searchQuery = NativeQuery.builder()
        .withQuery(q -> q
            .multiMatch(m -> m
                .fields("name")
                .type(TextQueryType.BoolPrefix)
                .query(keyword)))
        .withPageable(PageRequest.of(0, 5))
        .build();

    SearchHits<ItemDocument> searchHits = elasticsearchTemplate.search(searchQuery, ItemDocument.class);

    return searchHits.stream()
        .map(hit -> hit.getContent().getName())
        .distinct()
        .toList();
  }

}