package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Date;
import java.sql.Time;


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
    private Date created_date;
    private Time created_time;
}
