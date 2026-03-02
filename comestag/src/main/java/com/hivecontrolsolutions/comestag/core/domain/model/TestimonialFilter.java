package com.hivecontrolsolutions.comestag.core.domain.model;

import com.hivecontrolsolutions.comestag.core.domain.model.enums.SortType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Value;
import org.springframework.data.domain.Sort;

import java.time.Instant;


@Value
@Builder
@AllArgsConstructor
@Getter
public class TestimonialFilter {
    Integer minRating;          // e.g. 3 -> show 3+ stars
    Integer maxRating;          // optional
    Instant createdFrom;        // optional
    Instant createdTo;          // optional
    SortType sortType;

    public Sort toSort() {
        if (sortType == null)
            return Sort.by(Sort.Direction.DESC, "createdAt");
        return switch (sortType) {
            case MAX -> Sort.by(Sort.Direction.DESC, "rating");
            case MINE -> Sort.by(Sort.Direction.ASC, "rating");
            case OLDEST -> Sort.by(Sort.Direction.ASC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };
    }
}