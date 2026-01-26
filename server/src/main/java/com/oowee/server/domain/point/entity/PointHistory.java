package com.oowee.server.domain.point.entity;

import com.oowee.server.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@ToString(exclude = "member")
public class PointHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "point_history_id")
    private Long id;

    // 포인트 내역 (Member)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 변동되는 포인트 양 (부호 포함)
    @Column(nullable = false)
    private Long amount;

    // 변동 사유 (충전, 사용 등)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PointType type;

    // 변동 날짜
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Builder
    public PointHistory(Member member, Long amount, PointType type) {
        this.member = member;
        this.amount = amount;
        this.type = type;
    }
}
