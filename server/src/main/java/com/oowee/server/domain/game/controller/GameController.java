package com.oowee.server.domain.game.controller;

import com.oowee.server.domain.game.dto.GameRequest;
import com.oowee.server.domain.game.dto.GameResponse;
import com.oowee.server.domain.game.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @PostMapping("/dice")
    public ResponseEntity<GameResponse> playDiceGame(
            @RequestBody @Valid GameRequest request,
            Principal principal) {

        if (principal == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }

        return ResponseEntity.ok(
                gameService.playDiceGame(principal.getName(), request)
        );
    }
}
