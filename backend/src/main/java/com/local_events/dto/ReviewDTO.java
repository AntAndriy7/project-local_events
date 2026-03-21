package com.local_events.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewDTO {
    private Long id;
    private Long user_id;
    private String userName;
    private Long event_id;
    private int rating;
    private String comment;
    private LocalDate created_date;
    private LocalTime created_time;
}
