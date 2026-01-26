package com.oowee.server.domain.member.repository;

import com.oowee.server.domain.member.entity.Member;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByEmail(String email);

    boolean existsByNickname(String nickname);

    // 동시성 제어를 위한 락 걸린 조회 메서드
    @Lock(LockModeType.PESSIMISTIC_WRITE) // 다른 트랜잭션이 읽지도, 쓰지도 못하게 막음
    @Query("select m from Member m where m.email = :email")
    Optional<Member> findByEmailForUpdate(@Param("email") String email);
}
