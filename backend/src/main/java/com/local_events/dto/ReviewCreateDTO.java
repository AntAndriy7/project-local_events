package com.local_events.dto;

import lombok.Data;

@Data
public class ReviewCreateDTO {
    private Long eventId;
    private int rating; // 0 - питання, 1-5 - відгук
    private String comment;
    private Long parentId;
    private Long replyToId;
}