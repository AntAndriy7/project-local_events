package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;


@Data
@Entity
@Table(name = "\"districts\"")
public class District {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
}