package ru.bright.app.backend.controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.bright.app.backend.dto.AuthRequestDTO;
import ru.bright.app.backend.dto.RegisterRequestDTO;
import ru.bright.app.backend.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequestDTO request) {
        authService.register(request.user(), request.password());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody @Valid AuthRequestDTO request) {
        String token = authService.login(request.user(), request.password());
        return ResponseEntity.ok().body(Map.of("token", token));
    }

    @GetMapping("/auth/check")
    public ResponseEntity<?> checkAuth() {
        return ResponseEntity.ok().build();
    }
}
