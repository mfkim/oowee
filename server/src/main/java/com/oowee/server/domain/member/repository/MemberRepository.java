package com.oowee.server.domain.member.repository;

import com.oowee.server.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    // 닉네임 중복 검사
    boolean existsByNickname(String nickname);
}
