package com.oowee.server.domain.member.service;

import com.oowee.server.domain.member.dto.SignInRequest;
import com.oowee.server.domain.member.dto.SignUpRequest;
import com.oowee.server.domain.member.entity.Member;
import com.oowee.server.domain.member.entity.Role;
import com.oowee.server.domain.member.repository.MemberRepository;
import com.oowee.server.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    // 회원가입
    @Transactional
    public Long signUp(SignUpRequest request) {
        // 이메일 중복 검사
        if (memberRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        // 닉네임 중복 검사
        if (memberRepository.existsByNickname(request.getNickname())) {
            throw new IllegalArgumentException("이미 존재하는 닉네임입니다.");
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 저장
        Member member = Member.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .nickname(request.getNickname())
                .role(Role.USER)
                .build();

        return memberRepository.save(member).getId();
    }

    // 로그인
    @Transactional(readOnly = true)
    public String signIn(SignInRequest request) {
        String errorMessage = "이메일 또는 비밀번호가 일치하지 않습니다.";

        // 이메일 확인
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException(errorMessage));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new IllegalArgumentException(errorMessage);
        }

        // JWT 토큰 반환
        return jwtTokenProvider.createToken(member.getEmail());
    }

    @Transactional(readOnly = true)
    public Member getMember(String email) {
        return memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("회원을 찾을 수 없습니다."));
    }
}
