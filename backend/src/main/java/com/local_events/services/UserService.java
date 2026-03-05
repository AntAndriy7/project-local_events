package com.local_events.services;

import com.local_events.dto.AuthDTO;
import com.local_events.dto.UserDTO;
import com.local_events.entity.User;
import com.local_events.mapper.UserMapper;
import com.local_events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final UserMapper mapper = UserMapper.INSTANCE;

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(mapper::toDTO)
                .orElse(null);
    }

    public List<UserDTO> getUsersByIds(Set<Long> userIds) {
        return userRepository.findAllById(userIds)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public User getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setRecent_activity(new Date(System.currentTimeMillis()));
            userRepository.save(user);
        }
        return user;
    }

    public boolean authenticate(AuthDTO loginDTO) {
        User user = userRepository.findByEmail(loginDTO.getEmail());

        if (user != null) {
            return passwordEncoder.matches(loginDTO.getPassword(), user.getPassword());
        }
        return false;
    }

    public UserDTO createUser(UserDTO userDTO) {

        // Можна визначити як null і потім запропонувати додати у профілі
        userDTO.setDistrict("TEMP_Kyiv");
        userDTO.setRole("USER");

        userDTO.setCreated_at(new Date(System.currentTimeMillis()));
        userDTO.setRecent_activity(new Date(System.currentTimeMillis()));
        userDTO.setEvents_visited_count(0L);
        userDTO.setEvents_created_count(0L);
        userDTO.setTickets_purchased_count(0L);
        userDTO.setReviews_written_count(0L);

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(encodedPassword);

        User user = mapper.toEntity(userDTO);

        // ===== ВИВІД ПЕРЕД ЗБЕРЕЖЕННЯМ =====
        System.out.println("=== User BEFORE SAVE ===");
        System.out.println("id: " + user.getId());
        System.out.println("user_name: " + user.getUser_name());
        System.out.println("email: " + user.getEmail());
        System.out.println("phone_number: " + user.getPhone_number());
        System.out.println("password (encoded): " + user.getPassword());
        System.out.println("role: " + user.getRole());
        System.out.println("district: " + user.getDistrict());
        System.out.println("avatar_url: " + user.getAvatar_url());
        System.out.println("birth_date: " + user.getBirth_date());
        System.out.println("created_at: " + user.getCreated_at());
        System.out.println("recent_activity: " + user.getRecent_activity());
        System.out.println("events_visited_count: " + user.getEvents_visited_count());
        System.out.println("events_created_count: " + user.getEvents_created_count());
        System.out.println("tickets_purchased_count: " + user.getTickets_purchased_count());
        System.out.println("reviews_written_count: " + user.getReviews_written_count());
        System.out.println("========================");

        user = userRepository.save(user);

        return mapper.toDTO(user);
    }

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    if (userDTO.getUser_name() != null) {
                        existingUser.setUser_name(userDTO.getUser_name());
                    }
                    if (userDTO.getEmail() != null) {
                        existingUser.setEmail(userDTO.getEmail());
                    }
                    if (userDTO.getPhone_number() != null) {
                        existingUser.setPhone_number(userDTO.getPhone_number());
                    }
                    if (userDTO.getPassword() != null) {
                        existingUser.setPassword(userDTO.getPassword());
                    }
                    if (userDTO.getRole() != null) {
                        existingUser.setRole(userDTO.getRole());
                    }
                    if (userDTO.getDistrict() != null) {
                        existingUser.setDistrict(userDTO.getDistrict());
                    }
                    if (userDTO.getRecent_activity() != null) {
                        existingUser.setRecent_activity(userDTO.getRecent_activity());
                    }
                    if (userDTO.getAvatar_url() != null) {
                        existingUser.setAvatar_url(userDTO.getAvatar_url());
                    }
                    if (userDTO.getBirth_date() != null) {
                        existingUser.setBirth_date(userDTO.getBirth_date());
                    }
                    if (userDTO.getEvents_visited_count() != null) {
                        existingUser.setEvents_visited_count(userDTO.getEvents_visited_count());
                    }
                    if (userDTO.getEvents_created_count() != null) {
                        existingUser.setEvents_created_count(userDTO.getEvents_created_count());
                    }
                    if (userDTO.getTickets_purchased_count() != null) {
                        existingUser.setTickets_purchased_count(userDTO.getTickets_purchased_count());
                    }
                    if (userDTO.getReviews_written_count() != null) {
                        existingUser.setReviews_written_count(userDTO.getReviews_written_count());
                    }

                    return mapper.toDTO(userRepository.save(existingUser));
                })
                .orElse(null);
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Користувача не знайдено"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Старий пароль невірний");
        }

        String encodedNewPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedNewPassword);

        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
