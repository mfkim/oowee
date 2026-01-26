package com.oowee.server.domain.game.service;

import com.oowee.server.domain.game.dto.GameRequest;
import com.oowee.server.domain.game.dto.GameResponse;
import com.oowee.server.domain.game.enums.BettingType;
import com.oowee.server.domain.point.service.PointService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class GameService {

    private final PointService pointService;
    private final Random random = new Random();

    @Transactional
    public GameResponse playDiceGame(String email, GameRequest request) {
        // 1. 참가비 먼저 차감
        Long remainingPoints = pointService.usePoints(email, request.getBetAmount());

        // 2. 주사위 굴리기 (1 ~ 6)
        int diceNumber = random.nextInt(6) + 1;

        // 3. 주사위 결과 판정 (홀/짝)
        BettingType diceResult = (diceNumber % 2 != 0) ? BettingType.ODD : BettingType.EVEN;

        // 4. 승패 결정
        boolean isWin = diceResult == request.getBettingType();
        Long earnedAmount = 0L;

        if (isWin) {
            // 승리 시: 베팅 금액의 2배 지급 (원금 회수 + 1배 이득)
            earnedAmount = request.getBetAmount() * 2;
            remainingPoints = pointService.chargePoints(email, earnedAmount);
        }

        // 5. 결과
        return GameResponse.builder()
                .diceNumber(diceNumber)
                .result(diceResult)
                .isWin(isWin)
                .earnedAmount(earnedAmount)
                .currentBalance(remainingPoints)
                .message(isWin ? "축하합니다! 승리하셨습니다! 🎉" : "아쉽게도 패배하셨습니다.. 😭")
                .build();
    }
}
