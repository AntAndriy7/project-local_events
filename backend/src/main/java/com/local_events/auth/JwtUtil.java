package com.local_events.auth;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final Algorithm algorithm;
    private final long expirationTime;

    public JwtUtil(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expirationTime
    ) {
        this.algorithm = Algorithm.HMAC256(secret);
        this.expirationTime = expirationTime;
    }

    public String generate(String email, String role, String userName, int id) {
        return JWT.create()
                .withSubject(email)
                .withClaim("user_name", userName)
                .withClaim("role", role)
                .withClaim("id", id)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationTime))
                .sign(algorithm);
    }

    public boolean validate(String token) {
        System.out.println("PUBLIC boolean validate(String token)");
        try {
            JWTVerifier verifier = JWT.require(algorithm).build();
            verifier.verify(token);
            return true;
        } catch (JWTVerificationException e) {
            return false;
        }
    }

    public String getRole(String token) {
        return JWT.decode(token).getClaim("role").asString();
    }

    public Long getId(String token) {
        return JWT.decode(token).getClaim("id").asLong();
    }

    public String getEmail(String token) {
        return JWT.decode(token).getSubject();
    }
}