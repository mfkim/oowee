package com.oowee.server.global.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long tokenValidityInMilliseconds;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long tokenValidityInMilliseconds) {

        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);

        // 비밀키 길이 검사
        if (keyBytes.length < 32) {
            throw new IllegalArgumentException("JWT Secret Key는 최소 32바이트(256비트) 이상이어야 합니다.");
        }

        this.key = Keys.hmacShaKeyFor(keyBytes);

        this.tokenValidityInMilliseconds = tokenValidityInMilliseconds;
    }

    // 1. 토큰 생성
    public String createToken(String email) {
        long now = (new Date()).getTime();
        Date validity = new Date(now + this.tokenValidityInMilliseconds);

        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date(now))
                .expiration(validity)
                .signWith(key)
                .compact();
    }

    // 2. 토큰에서 이메일 꺼내기
    public String getEmail(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // 3. 유효성 검사
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.error("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.error("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.error("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.error("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }
}
