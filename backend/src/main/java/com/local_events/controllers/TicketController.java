package com.local_events.controllers;

import com.local_events.dto.TicketDTO;
import com.local_events.dto.TicketListEventResponse;
import com.local_events.dto.TicketListResponse;
import com.local_events.dto.TicketRequestDTO;
import com.local_events.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<TicketListEventResponse> getTicketsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ticketService.getTicketsByEvent(eventId));
    }

    @GetMapping("/booking")
    public ResponseEntity<TicketListResponse> getMyTickets(@RequestAttribute("userId") Long userId) {
        return ResponseEntity.ok(ticketService.getTicketsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(@RequestBody TicketRequestDTO ticketRequestDTO, @RequestAttribute("userId") Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.reserveTicket(ticketRequestDTO, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelTicket(@PathVariable Long id, @RequestAttribute("userId") Long userId) {
        ticketService.cancelReservation(id, userId);
        return ResponseEntity.noContent().build();
    }
}
