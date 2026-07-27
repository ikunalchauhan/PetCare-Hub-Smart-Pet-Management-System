package com.petcare.hub.controller;

import com.petcare.hub.exception.BadRequestException;
import com.petcare.hub.model.User;
import com.petcare.hub.security.SecurityUtils;
import com.petcare.hub.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login and profile management")
public class AuthController {

    private final AuthService authService;
    private final SecurityUtils securityUtils;

    public AuthController(AuthService authService, SecurityUtils securityUtils) {
        this.authService = authService;
        this.securityUtils = securityUtils;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(user));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate and receive a JWT token")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        if (email == null || password == null) {
            throw new BadRequestException("Email and password are required");
        }
        return ResponseEntity.ok(authService.login(email, password));
    }

    @GetMapping("/me")
    @Operation(summary = "Get the currently authenticated user's profile")
    public ResponseEntity<User> getCurrentUser() {
        User user = authService.getCurrentUser(securityUtils.getCurrentUserId());
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    @Operation(summary = "Update the currently authenticated user's profile")
    public ResponseEntity<User> updateProfile(@RequestBody User updates) {
        User user = authService.updateProfile(securityUtils.getCurrentUserId(), updates);
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
