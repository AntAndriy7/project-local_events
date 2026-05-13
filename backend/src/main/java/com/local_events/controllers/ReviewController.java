package com.local_events.controllers;

import com.local_events.dto.ReviewCreateDTO;
import com.local_events.dto.ReviewDTO;
import com.local_events.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewCreateDTO reviewCreateDTO, @RequestAttribute("userId") Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReview(reviewCreateDTO, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, @RequestAttribute("userId") Long userId) {
        reviewService.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }
}
