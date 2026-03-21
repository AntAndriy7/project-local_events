package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;


@Data
@Entity
@Table(name = "\"reviews\"")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Long event_id;
    private int rating;
    private String comment;
    private LocalDate created_date;
    private LocalTime created_time;
}
