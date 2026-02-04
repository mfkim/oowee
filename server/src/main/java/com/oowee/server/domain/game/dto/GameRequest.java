package com.oowee.server.domain.game.dto;

import com.oowee.server.domain.game.enums.BettingType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameRequest {

    @NotNull(message = "베팅 금액은 필수입니다.")
    @Min(value = 1000, message = "최소 베팅 금액은 1000포인트입니다.")
    private Long betAmount;

    @NotNull(message = "홀수 또는 짝수 선택은 필수입니다.")
    private BettingType bettingType;
}
