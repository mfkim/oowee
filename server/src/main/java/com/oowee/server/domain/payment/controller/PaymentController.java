package com.oowee.server.domain.payment.controller;

import com.oowee.server.domain.payment.dto.PaymentRequest;
import com.oowee.server.domain.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/complete")
    public ResponseEntity<Map<String, Object>> completePayment(
            @RequestBody PaymentRequest request,
            Principal principal) {

        if (principal == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        log.info("결제 검증 요청: email={}, paymentId={}, orderId={}",
                principal.getName(), request.getPaymentId(), request.getOrderId());

        // 검증 서비스 호출 -> 성공 시 충전된 포인트 잔액 반환
        Long currentPoints = paymentService.verifyPayment(
                principal.getName(),
                request.getPaymentId(),
                request.getOrderId(),
                request.getAmount()
        );

        return ResponseEntity.ok(Map.of(
                "message", "결제 검증 및 포인트 충전 완료!",
                "currentPoints", currentPoints
        ));
    }
}
