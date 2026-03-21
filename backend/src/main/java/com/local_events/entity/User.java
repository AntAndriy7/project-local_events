package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "\"users\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String user_name;
    private String email;
    private String phone_number;
    private String password;
    private String role;
    private String district;
    private LocalDate created_at;
    private LocalDate recent_activity;
    private String avatar_url;
    private LocalDate birth_date;
    private Long events_visited_count;
    private Long events_created_count;
    private Long tickets_purchased_count;
    private Long reviews_written_count;
}
