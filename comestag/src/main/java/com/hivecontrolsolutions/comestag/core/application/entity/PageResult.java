package com.hivecontrolsolutions.comestag.core.application.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Value;
import org.springframework.data.domain.Page;

import java.util.List;

@Value
@Builder
@AllArgsConstructor
public class PageResult<T> {
    List<T> items;
    int page;          // 0-based
    int size;
    long totalItems;
    int totalPages;
    boolean first;
    boolean last;

    public static <T> PageResult<T> of(Page<T> page) {
        return PageResult.<T>builder()
                .items(page.getContent())
                .page(page.getNumber())
                .size(page.getSize())
                .totalItems(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
    public static <T> PageResult<T> of(List<T> items, int page, int size, long totalItems) {
        int totalPages = (int) Math.ceil((double) totalItems / (double) size);
        boolean first = page == 0;
        boolean last = page >= Math.max(totalPages - 1, 0);

        return PageResult.<T>builder()
                .items(items)
                .page(page)
                .size(size)
                .totalItems(totalItems)
                .totalPages(totalPages)
                .first(first)
                .last(last)
                .build();
    }

}

