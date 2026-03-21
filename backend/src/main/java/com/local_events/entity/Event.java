package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "\"events\"")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private Long user_id;
    private Long category_id;
    private Long district_id;
    private int capacity;
    private int occupied_seats;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    @Column(name = "image_url")
    private String imageUrl;
}
