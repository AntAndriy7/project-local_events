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
    private Long userId;
    private Long categoryId;
    private Long districtId;
    private int capacity;
    private int occupiedSeats;

    @Enumerated(EnumType.STRING)
    private EventStatus status;

    private String imageUrl;
}
