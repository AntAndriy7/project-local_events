package com.local_events.controllers;

import com.local_events.auth.JwtUtil;
import com.local_events.dto.AuthDTO;
import com.local_events.dto.ChangePasswordDTO;
import com.local_events.dto.UserDTO;
import com.local_events.entity.User;
import com.local_events.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final JwtUtil jwtUtil;
    private final UserService userService;

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {

        Map<String, Object> response = new HashMap<>();

        UserDTO createdUser = userService.createUser(userDTO);

        if (createdUser == null) {
            response.put("message", "User registration failed");
            return ResponseEntity.badRequest().body(response);
        }

        String token = jwtUtil.generate(
                createdUser.getEmail(),
                createdUser.getRole(),
                createdUser.getUser_name(),
                Math.toIntExact(createdUser.getId())
        );

        response.put("token", token);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", createdUser.getId());
        userData.put("user_name", createdUser.getUser_name());
        userData.put("email", createdUser.getEmail());
//        userData.put("phone_number", createdUser.getPhone_number());
        userData.put("role", createdUser.getRole());

        response.put("user", userData);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDTO authDTO) {
        Map<String, Object> response = new HashMap<>();

        System.out.println(authDTO.getEmail());
        System.out.println(authDTO.getPassword());

        try {
            if (!userService.authenticate(authDTO)) {
                response.put("message", "Incorrect email address or password.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            User user = userService.getUserByEmail(authDTO.getEmail());

            String token = jwtUtil.generate(
                    user.getEmail(),
                    user.getRole(),
                    user.getUser_name(),
                    Math.toIntExact(user.getId())
            );

            response.put("token", token);

            Map<String, Object> userData = new HashMap<>();
            userData.put("id", user.getId());
            userData.put("user_name", user.getUser_name());
            userData.put("email", user.getEmail());
            userData.put("phone_number", user.getPhone_number());
            userData.put("role", user.getRole());

            response.put("user", userData);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id,
                                         @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        if (!userId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Ви не можете редагувати чужий профіль"));
        }

        return ResponseEntity.ok(userService.getUserById(id));
    }


    @PutMapping()
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO,
                                        @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        try {
            UserDTO updatedUser = userService.updateUser(userId, userDTO);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Помилка при оновленні: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO dto,
                                            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        try {
            userService.changePassword(userId, dto.getOldPassword(), dto.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Пароль успішно змінено!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
