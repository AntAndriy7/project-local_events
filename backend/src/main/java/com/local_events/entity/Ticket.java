package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "\"tickets\"")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long user_id;
    private Long event_id;

    private int quantity;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;

    private LocalDate created_at;
}
