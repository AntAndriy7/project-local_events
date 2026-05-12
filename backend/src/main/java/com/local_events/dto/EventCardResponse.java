package com.local_events.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EventCardResponse {
    private EventDTO event;
    private DistrictDTO district;
    private CategoryDTO category;
}