package com.local_events.controllers;

import com.local_events.auth.JwtUtil;
import com.local_events.dto.EventDTO;
import com.local_events.dto.EventStatusUpdateDTO;
import com.local_events.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final JwtUtil jwtUtil;
    private final EventService eventService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        Map<String, Object> event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @GetMapping("/popular")
    public ResponseEntity<?> getPopularEvent() {
        Map<String, Object> result = eventService.getPopularEvent();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        Map<String, Object> result = eventService.getAllEvents();
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<?> getAllAvailable() {
        System.out.println("API events");
        Map<String, Object> result = eventService.getAllAvailableEvents();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyEvents(@RequestHeader("Authorization") String authHeader) {

        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        Map<String, Object> result = eventService.getMyEvents(userId);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO eventDTO,
                                                @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        EventDTO createdEvent = eventService.createEvent(eventDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id, @RequestBody EventDTO eventDTO,
                                                @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        EventDTO updatedEvent = eventService.updateEvent(id, eventDTO, userId);
        return ResponseEntity.ok(updatedEvent);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EventDTO> updateStatus(@PathVariable Long id,
                                                 @RequestBody EventStatusUpdateDTO dto) {
        EventDTO updated = eventService.updateEventStatus(id, dto.getStatus());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        eventService.deleteEvent(id, userId);
        return ResponseEntity.noContent().build();
    }
}
