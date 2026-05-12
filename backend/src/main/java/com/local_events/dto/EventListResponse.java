package com.local_events.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventListResponse {
    private List<EventDTO> events;
    private List<DistrictDTO> districts;
    private List<CategoryDTO> categories;
}