package com.oowee.server.domain.game.dto;

import com.oowee.server.domain.game.enums.BettingType;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GameResponse {
    private int diceNumber;       // 1 ~ 6
    private BettingType result;   // ODD / EVEN
    private boolean isWin;        // 승리 여부
    private Long earnedAmount;    // 획득한 금액 (패배 시 0)
    private Long currentBalance;  // 게임 후 잔액
    private String message;
}
