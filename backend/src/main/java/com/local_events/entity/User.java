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
    private String userName;
    private String email;
    private String phoneNumber;
    private String password;
    private String role;
    private String district;
    private LocalDate createdAt;
    private LocalDate recentActivity;
    private String avatarUrl;
    private LocalDate birthDate;
    private Long eventsVisitedCount;
    private Long eventsCreatedCount;
    private Long ticketsPurchasedCount;
    private Long reviewsWrittenCount;
}
