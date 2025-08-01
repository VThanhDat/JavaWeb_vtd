package com.aris.javaweb_vtd.elasticsearch.repository;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.TermQuery;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.*;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Repository;

import com.aris.javaweb_vtd.dto.common.ItemSearchDTO;
import com.aris.javaweb_vtd.dto.common.PageDTO;
import com.aris.javaweb_vtd.elasticsearch.document.ItemDocument;

@Repository
@RequiredArgsConstructor
public class ItemSearchCustomRepositoryImpl implements ItemSearchCustomRepository {

  private final ElasticsearchTemplate elasticsearchTemplate;

  @Override
  public PageDTO<ItemDocument> searchItems(ItemSearchDTO dto) {
    BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();

    if (dto.getName() != null && !dto.getName().isBlank()) {
      boolQueryBuilder.must(QueryStringQuery.of(q -> q
          .query("*" + dto.getName().trim() + "*")
          .fields("name", "name.keyword")
          .defaultOperator(co.elastic.clients.elasticsearch._types.query_dsl.Operator.And))._toQuery());
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
}