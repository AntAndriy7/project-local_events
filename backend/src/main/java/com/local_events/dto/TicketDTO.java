package com.local_events.dto;

import com.local_events.entity.TicketStatus;
import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketDTO {
    private Long id;
    private Long user_id;
    private Long event_id;
    private int quantity;
    private TicketStatus status;
    private LocalDate created_at;
}
