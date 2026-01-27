package com.oowee.server.domain.payment.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true) // 필요한 필드만 골라 받기 위해 사용
public class PortOnePaymentResponse {

    private String id;        // 결제 ID (paymentId)
    private String status;    // 결제 상태 (PAID, FAILED 등)
    private Amount amount;    // 결제 금액 정보 (객체로 옴)
    private String orderName; // 주문명

    @Getter
    @NoArgsConstructor
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Amount {
        private Long total;   // 총 결제 금액
    }
}
