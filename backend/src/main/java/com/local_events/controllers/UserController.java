package com.local_events.controllers;

import com.local_events.auth.JwtUtil;
import com.local_events.dto.*;
import com.local_events.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @GetMapping()
    public ResponseEntity<UserDTO> getUserById(@RequestAttribute("userId") Long userId) {
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserCreateDTO userCreateDTO) {
        try {
            UserDTO createdUser = userService.createUser(userCreateDTO);

            String token = jwtUtil.generate(
                    createdUser.getEmail(),
                    createdUser.getRole(),
                    createdUser.getUserName(),
                    Math.toIntExact(createdUser.getId())
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponseDTO(token, createdUser));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        try {
            UserDTO user = userService.authenticateUser(authDTO);

            String token = jwtUtil.generate(
                    user.getEmail(),
                    user.getRole(),
                    user.getUserName(),
                    Math.toIntExact(user.getId())
            );

            return ResponseEntity.ok(new AuthResponseDTO(token, user));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping()
    public ResponseEntity<UserDTO> updateUser(@RequestBody UserUpdateDTO userUpdateDTO, @RequestAttribute("userId") Long userId) {
        return ResponseEntity.ok(userService.updateUser(userId, userUpdateDTO));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto, @RequestAttribute("userId") Long userId) {
        try {
            userService.changePassword(userId, dto.getOldPassword(), dto.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
