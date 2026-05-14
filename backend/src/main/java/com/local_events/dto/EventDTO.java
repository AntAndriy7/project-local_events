package com.local_events.dto;

import com.local_events.entity.EventStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {
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
    private EventStatus status;
    private String imageUrl;
    private boolean isFavorite;
}
