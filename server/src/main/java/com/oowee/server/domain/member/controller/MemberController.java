package com.oowee.server.domain.member.controller;

import com.oowee.server.domain.member.dto.SignInRequest;
import com.oowee.server.domain.member.dto.SignUpRequest;
import com.oowee.server.domain.member.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody @Valid SignUpRequest request) {
        // 반환값(ID)은 받지만, 사용자에게 보여주지 않음
        memberService.signUp(request);

        return ResponseEntity.ok(Map.of(
                "message", "회원가입 성공!"
        ));
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, String>> signIn(@RequestBody @Valid SignInRequest request) {
        String token = memberService.signIn(request);

        return ResponseEntity.ok(Map.of(
                "message", "로그인 성공!",
                "token", token
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, String>> getMyInfo(Principal principal) {
        // Principal이 없으면 에러 처리
        if (principal == null) {
            throw new IllegalArgumentException("인증 정보가 유효하지 않습니다.");
        }

        return ResponseEntity.ok(Map.of(
                "message", "내 정보 조회 성공!",
                "email", principal.getName(),
                "role", "USER"
        ));
    }
}
