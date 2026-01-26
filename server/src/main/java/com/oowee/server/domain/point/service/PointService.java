package com.oowee.server.domain.point.service;

import com.oowee.server.domain.member.entity.Member;
import com.oowee.server.domain.member.repository.MemberRepository;
import com.oowee.server.domain.point.dto.PointHistoryResponse;
import com.oowee.server.domain.point.entity.PointHistory;
import com.oowee.server.domain.point.entity.PointType;
import com.oowee.server.domain.point.repository.PointHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PointService {

    private final MemberRepository memberRepository;
    private final PointHistoryRepository pointHistoryRepository;

    /**
     * 포인트 충전
     */
    @Transactional
    public Long chargePoints(String email, Long amount) {
        // 1. 회원 조회
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 2. 회원 테이블의 잔액 변경
        member.updatePoints(amount);

        // 3. 내역 저장
        pointHistoryRepository.save(PointHistory.builder()
                .member(member)
                .amount(amount)
                .type(PointType.CHARGE)
                .build());

        // 4. 변경된 잔액 반환
        return member.getCurrentPoints();
    }

    /**
     * 포인트 사용
     */
    @Transactional
    public Long usePoints(String email, Long amount) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        // 1. 잔액 차감
        member.updatePoints(-amount);

        // 2. 내역 저장
        pointHistoryRepository.save(PointHistory.builder()
                .member(member)
                .amount(-amount)
                .type(PointType.USE)
                .build());

        return member.getCurrentPoints();
    }

    /**
     * 내 포인트 내역 조회
     */
    @Transactional(readOnly = true)
    public List<PointHistoryResponse> getMyPointHistory(String email) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));

        return pointHistoryRepository.findByMemberOrderByCreatedAtDesc(member)
                .stream()
                .map(PointHistoryResponse::new)
                .collect(Collectors.toList());
    }
}
