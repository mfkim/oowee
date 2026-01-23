package com.oowee.server.controller;

import com.oowee.server.domain.member.dto.SignUpRequest;
import com.oowee.server.domain.member.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody SignUpRequest request) {
        Long memberId = memberService.signUp(request);

        return ResponseEntity.ok(Map.of(
                "message", "회원가입 성공!",
                "memberId", memberId.toString()
        ));
    }
}
