package com.local_events.controllers;

import com.local_events.dto.EventDTO;
import com.local_events.services.FavoriteEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteEventController {

    private final FavoriteEventService favoriteService;

    @GetMapping
    public ResponseEntity<List<EventDTO>> getMyFavorites(@RequestAttribute("userId") Long userId) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<Void> addToFavorite(@PathVariable Long eventId, @RequestAttribute("userId") Long userId) {
        favoriteService.addToFavorite(userId, eventId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> removeFromFavorite(@PathVariable Long eventId, @RequestAttribute("userId") Long userId) {
        favoriteService.removeFromFavorite(userId, eventId);
        return ResponseEntity.noContent().build();
    }
}
