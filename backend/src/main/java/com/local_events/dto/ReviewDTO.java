package com.local_events.dto;

import lombok.*;
import java.sql.Date;
import java.sql.Time;

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
    private Date created_date;
    private Time created_time;
}
