package ru.bright.app.backend.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class TokenManager {

    private SecretKey secretKey;
    private long lifeTime;

    public TokenManager(@Value("${jwt.key_life_time_hours}") int lifeHours, @Value("${jwt.secret_key}") String stringSecretKey) {
        this.lifeTime = 1000L*60L*60L*lifeHours;
        this.secretKey = Keys.hmacShaKeyFor(stringSecretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + lifeTime))
                .signWith(secretKey)
                .compact();
    }

    public String getUserByToken(String token) {
        return getTokenClaims(token).getSubject();
    }

    private Claims getTokenClaims(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenExpired(String token) {
        return getTokenClaims(token).getExpiration().before(new Date());
    }
}