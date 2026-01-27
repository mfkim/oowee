package com.oowee.server.domain.payment.repository;

import com.oowee.server.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // 주문 번호로 결제 내역 찾기
    Optional<Payment> findByOrderId(String orderId);

    // 포트원 결제 ID로 찾기
    Optional<Payment> findByPaymentId(String paymentId);
}
