package com.local_events.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketListEventResponse {
    private List<TicketDTO> tickets;
    private List<UserDTO> users;
}
