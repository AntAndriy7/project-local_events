package com.local_events.dto;

import com.local_events.entity.EventStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class EventStatusUpdateDTO {
    private EventStatus status;
}

