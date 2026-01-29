package com.oowee.server.domain.member.controller;

import com.oowee.server.domain.member.dto.SignInRequest;
import com.oowee.server.domain.member.dto.SignUpRequest;
import com.oowee.server.domain.member.entity.Member;
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

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody @Valid SignInRequest request) {
        String token = memberService.signIn(request);

        return ResponseEntity.ok(Map.of(
                "message", "로그인 성공!",
                "token", token
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMyInfo(Principal principal) {
        if (principal == null) {
            throw new IllegalArgumentException("인증 정보가 유효하지 않습니다.");
        }

        Member member = memberService.getMember(principal.getName());

        return ResponseEntity.ok(Map.of(
                "email", member.getEmail(),
                "nickname", member.getNickname(),
                "point", member.getCurrentPoints(),
                "role", member.getRole()
        ));
    }
}
