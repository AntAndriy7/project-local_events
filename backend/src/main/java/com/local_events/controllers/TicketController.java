package com.local_events.controllers;

import com.local_events.auth.JwtUtil;
import com.local_events.dto.TicketDTO;
import com.local_events.dto.TicketRequestDTO;
import com.local_events.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final JwtUtil jwtUtil;
    private final TicketService ticketService;

    @GetMapping("/event/{eventId}")
    public ResponseEntity<Map<String, Object>> getTicketsByEvent(@PathVariable Long eventId) {
        return ResponseEntity.ok(ticketService.getTicketsByEvent(eventId));
    }

    @GetMapping("/booking")
    public ResponseEntity<Map<String, Object>> getTicketsById(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        return ResponseEntity.ok(ticketService.getTicketsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<TicketDTO> createTicket(@RequestBody TicketRequestDTO ticketRequestDTO,
                                                  @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        return ResponseEntity.status(HttpStatus.CREATED).body(ticketService.reserveTicket(ticketRequestDTO, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelTicket(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        ticketService.cancelReservation(id, userId);
        return ResponseEntity.noContent().build();
    }
}
