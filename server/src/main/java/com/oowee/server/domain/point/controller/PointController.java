package com.oowee.server.domain.point.controller;

import com.oowee.server.domain.point.dto.PointHistoryResponse;
import com.oowee.server.domain.point.dto.PointRequest;
import com.oowee.server.domain.point.service.PointService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;

    // 1. 포인트 충전
    @PostMapping("/charge")
    public ResponseEntity<Map<String, Object>> chargePoints(
            @RequestBody @Valid PointRequest request,
            Principal principal) {

        if (principal == null) {
            throw new IllegalArgumentException("인증 정보가 유효하지 않습니다.");
        }

        Long currentBalance = pointService.chargePoints(principal.getName(), request.getAmount());

        return ResponseEntity.ok(Map.of(
                "message", "포인트 충전 완료!",
                "chargedAmount", request.getAmount(),
                "currentBalance", currentBalance
        ));
    }

    // 2. 포인트 사용 (API 테스트)
    @PostMapping("/use")
    public ResponseEntity<Map<String, Object>> usePoints(
            @RequestBody @Valid PointRequest request,
            Principal principal) {

        if (principal == null) {
            throw new IllegalArgumentException("인증 정보가 유효하지 않습니다.");
        }

        Long currentBalance = pointService.usePoints(principal.getName(), request.getAmount());

        return ResponseEntity.ok(Map.of(
                "message", "포인트 사용 완료!",
                "usedAmount", request.getAmount(),
                "currentBalance", currentBalance
        ));
    }

    // 3. 내 포인트 내역 조회
    @GetMapping("/history")
    public ResponseEntity<List<PointHistoryResponse>> getMyPointHistory(Principal principal) {

        // 👇 [리뷰 반영] 안전벨트 착용
        if (principal == null) {
            throw new IllegalArgumentException("인증 정보가 유효하지 않습니다.");
        }

        return ResponseEntity.ok(
                pointService.getMyPointHistory(principal.getName())
        );
    }
}
