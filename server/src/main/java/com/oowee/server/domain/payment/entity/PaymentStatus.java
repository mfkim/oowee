package com.oowee.server.domain.payment.entity;

public enum PaymentStatus {
    READY,      // 결제 요청 전/중
    PAID,       // 결제 완료 (검증 성공)
    FAILED,     // 결제 실패
    CANCELLED   // 결제 취소 (환불)
}
