package com.local_events.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long userId;
    private String userName;
    private Long eventId;
    private int rating;
    private String comment;
    private LocalDate createdDate;
    private LocalTime createdTime;
}
