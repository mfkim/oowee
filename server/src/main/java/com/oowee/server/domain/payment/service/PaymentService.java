package com.oowee.server.domain.payment.service;

import com.oowee.server.domain.member.entity.Member;
import com.oowee.server.domain.member.repository.MemberRepository;
import com.oowee.server.domain.payment.dto.PaymentRequest;
import com.oowee.server.domain.payment.dto.PortOnePaymentResponse;
import com.oowee.server.domain.payment.entity.Payment;
import com.oowee.server.domain.payment.entity.PaymentStatus;
import com.oowee.server.domain.payment.repository.PaymentRepository;
import com.oowee.server.domain.point.service.PointService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final MemberRepository memberRepository;
    private final PointService pointService; // 포인트 충전

    @Value("${portone.api-secret}")
    private String apiSecret;

    private final RestClient restClient = RestClient.create();

    @Transactional
    public Long verifyPayment(String email, String paymentId, String orderId, Long amount) {
        // 1. 사용자 조회
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 2. 포트원 서버 조회 (API 요청)
        PortOnePaymentResponse response = restClient.get()
                .uri("https://api.portone.io/payments/" + paymentId)
                .header("Authorization", "PortOne " + apiSecret)
                .retrieve()
                .body(PortOnePaymentResponse.class);

        if (response == null) {
            throw new IllegalArgumentException("포트원 결제 조회 실패");
        }

        // 3. 검증: "결제 완료" 상태 확인 && 요청 "금액" 확인
        if (!"PAID".equals(response.getStatus())) {
            throw new IllegalArgumentException("결제가 완료되지 않았습니다. 상태: " + response.getStatus());
        }

        if (response.getAmount().getTotal() == null || !response.getAmount().getTotal().equals(amount)) {
            throw new IllegalArgumentException("결제 금액 불일치! (요청: " + amount + ", 실제: " + response.getAmount().getTotal() + ")");
        }

        // 4. 결제 내역 저장 (DB)
        Payment payment = Payment.builder()
                .member(member)
                .paymentId(paymentId)
                .orderId(orderId)
                .amount(amount)
                .orderName(response.getOrderName())
                .status(PaymentStatus.PAID)
                .build();

        paymentRepository.save(payment);

        // 5. 포인트 충전
        return pointService.chargePoints(email, amount);
    }
}
