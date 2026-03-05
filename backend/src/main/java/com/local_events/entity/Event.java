package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Date;
import java.sql.Time;

@Data
@Entity
@Table(name = "\"events\"")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Date date;
    private Time time;
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
