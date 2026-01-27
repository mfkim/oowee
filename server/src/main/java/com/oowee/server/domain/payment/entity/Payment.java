package com.oowee.server.domain.payment.entity;

import com.oowee.server.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 결제한 회원
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    // [V2] 포트원 결제 고유 ID
    // 결제 검증할 때 이 값으로 포트원 서버에 조회
    @Column(nullable = false, unique = true)
    private String paymentId;

    // [V2] 우리 서버 주문 ID
    // 프론트엔드에서 UUID 등을 이용해 생성해서 보냄
    @Column(nullable = false, unique = true)
    private String orderId;

    // 결제 금액 (실제 결제된 금액)
    @Column(nullable = false)
    private Long amount;

    // 주문명
    private String orderName;

    // 결제 상태
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    public Payment(Member member, String paymentId, String orderId, Long amount, String orderName, PaymentStatus status) {
        this.member = member;
        this.paymentId = paymentId;
        this.orderId = orderId;
        this.amount = amount;
        this.orderName = orderName;
        this.status = status;
    }

    // 결제 검증 후 상태 변경 (PAID, FAILED 등)
    public void changeStatus(PaymentStatus status) {
        this.status = status;
    }
}
