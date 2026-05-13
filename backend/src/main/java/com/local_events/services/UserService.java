package com.local_events.services;

import com.local_events.dto.AuthDTO;
import com.local_events.dto.UserCreateDTO;
import com.local_events.dto.UserDTO;
import com.local_events.dto.UserUpdateDTO;
import com.local_events.entity.User;
import com.local_events.mapper.UserMapper;
import com.local_events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final UserMapper mapper = UserMapper.INSTANCE;

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return mapper.toDTO(user);
    }

    public List<UserDTO> getUsersByIds(Set<Long> userIds) {
        return userRepository.findAllById(userIds)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    @Transactional
    public UserDTO authenticateUser(AuthDTO authDTO) {
        User user = userRepository.findByEmail(authDTO.getEmail());

        if (user == null || !passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Incorrect email or password");
        }

        user.setRecentActivity(LocalDate.now());

        return mapper.toDTO(user);
    }

    @Transactional
    public UserDTO createUser(UserCreateDTO userCreateDTO) {
        if (userCreateDTO.getEmail() == null || userCreateDTO.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email обов'язковий");
        }
        if (userCreateDTO.getPassword() == null || userCreateDTO.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password required");
        }
        if (userCreateDTO.getUserName() == null || userCreateDTO.getUserName().isBlank()) {
            throw new IllegalArgumentException("Username is required.");
        }
        if (userRepository.existsByEmail(userCreateDTO.getEmail())) {
            throw new IllegalArgumentException("A user with this email already exists.");
        }

        User user = new User();
        user.setUserName(userCreateDTO.getUserName());
        user.setEmail(userCreateDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userCreateDTO.getPassword()));

        user.setRole("USER");
        user.setCreatedAt(LocalDate.now());
        user.setRecentActivity(LocalDate.now());
        user.setEventsVisitedCount(0L);
        user.setEventsCreatedCount(0L);
        user.setTicketsPurchasedCount(0L);
        user.setReviewsWrittenCount(0L);

        User savedUser = userRepository.save(user);
        return mapper.toDTO(savedUser);
    }

    @Transactional
    public UserDTO updateUser(Long id, UserUpdateDTO updateDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (updateDTO.getUserName() != null) {
            existingUser.setUserName(updateDTO.getUserName());
        }
        if (updateDTO.getEmail() != null) {
            existingUser.setEmail(updateDTO.getEmail());
        }
        if (updateDTO.getBirthDate() != null) {
            existingUser.setBirthDate(updateDTO.getBirthDate());
        }
        if (updateDTO.getDistrict() != null) {
            existingUser.setDistrict(updateDTO.getDistrict());
        }

        return mapper.toDTO(existingUser);
    }

    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect.");
        }

        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPassword);
    }
}
