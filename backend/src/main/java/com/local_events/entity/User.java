package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Date;

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
    private Date created_at;
    private Date recent_activity;
    private String avatar_url;
    private Date birth_date;
    private Long events_visited_count;
    private Long events_created_count;
    private Long tickets_purchased_count;
    private Long reviews_written_count;
}
