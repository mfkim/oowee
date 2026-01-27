package com.oowee.server.domain.payment.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PaymentRequest {
    private String paymentId; // 포트원 결제 ID
    private String orderId;   // 주문 ID
    private Long amount;      // 결제 금액
}
