package com.oowee.server.domain.point.dto;

import com.oowee.server.domain.point.entity.PointHistory;
import com.oowee.server.domain.point.entity.PointType;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class PointHistoryResponse {

    private final Long id;
    private final Long amount;
    private final PointType type;
    private final LocalDateTime createdAt;

    // Entity -> DTO
    public PointHistoryResponse(PointHistory history) {
        this.id = history.getId();
        this.amount = history.getAmount();
        this.type = history.getType();
        this.createdAt = history.getCreatedAt();
    }
}
