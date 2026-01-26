package com.oowee.server.domain.point.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PointRequest {

    @NotNull(message = "금액은 필수 입력값입니다.")
    @Min(value = 1, message = "1 포인트 이상 입력해주세요.")
    private Long amount;
}
