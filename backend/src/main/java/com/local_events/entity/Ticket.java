package com.local_events.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.sql.Date;

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

    private Date created_at;
}
