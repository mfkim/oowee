package com.oowee.server.domain.point.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PointType {
    CHARGE("충전"),
    USE("사용"),
    REWARD("획득"),
    REFUND("환불");

    private final String description;
}
