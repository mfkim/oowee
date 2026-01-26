package com.oowee.server.domain.point.repository;

import com.oowee.server.domain.point.entity.PointHistory;
import com.oowee.server.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PointHistoryRepository extends JpaRepository<PointHistory, Long> {

    // 특정 회원의 포인트 내역 조회 (최신순)
    List<PointHistory> findByMemberOrderByCreatedAtDesc(Member member);
}
