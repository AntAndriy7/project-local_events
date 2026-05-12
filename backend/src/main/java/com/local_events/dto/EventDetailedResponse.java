package com.local_events.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class EventDetailedResponse {
    private EventDTO event;
    private DistrictDTO district;
    private CategoryDTO category;
    private List<ReviewDTO> reviews;
}