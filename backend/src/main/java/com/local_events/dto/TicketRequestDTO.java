package com.local_events.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketRequestDTO {
    private Long eventId;
    private int quantity;
}
