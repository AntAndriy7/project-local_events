package com.local_events.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventCreateDTO {
    private String title;
    private String description;
    private LocalDate date;
    private LocalTime time;
    private int capacity;
    private Long categoryId;
    private Long districtId;
    private String imageUrl;
}