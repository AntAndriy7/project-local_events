package com.local_events.controllers;

import com.local_events.dto.*;
import com.local_events.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/{id}")
    public ResponseEntity<EventDetailedResponse> getEventById(@PathVariable Long id, @RequestAttribute(value = "userId", required = false) Long userId) {
        return ResponseEntity.ok(eventService.getEventById(id, userId));
    }

    @GetMapping("/popular")
    public ResponseEntity<EventCardResponse> getPopularEvent() {
        return ResponseEntity.ok(eventService.getPopularEvent());
    }

    @GetMapping("/all")
    public ResponseEntity<EventListResponse> getAll() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping
    public ResponseEntity<EventListResponse> getAllAvailable(@RequestAttribute(value = "userId", required = false) Long userId) {
        return ResponseEntity.ok(eventService.getAllAvailableEvents(userId));
    }

    @GetMapping("/my")
    public ResponseEntity<EventListResponse> getMyEvents(@RequestAttribute("userId") Long userId) {
        return ResponseEntity.ok(eventService.getMyEvents(userId));
    }

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventCreateDTO eventDTO, @RequestAttribute("userId") Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(eventDTO, userId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EventDTO> updateStatus(@PathVariable Long id, @RequestBody EventStatusUpdateDTO dto) {
        return ResponseEntity.ok(eventService.updateEventStatus(id, dto.getStatus()));
    }
}
