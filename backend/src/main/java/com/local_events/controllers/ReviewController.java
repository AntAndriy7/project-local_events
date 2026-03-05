package com.local_events.controllers;

import com.local_events.auth.JwtUtil;
import com.local_events.dto.ReviewDTO;
import com.local_events.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final JwtUtil jwtUtil;
    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getReviewsByEventIds(@RequestParam Set<Long> eventIds) {
        List<ReviewDTO> reviews = reviewService.getReviewsByEventIds(eventIds);
        if (reviews.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@RequestBody ReviewDTO reviewDTO,
                                                  @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        ReviewDTO savedReview = reviewService.createReview(reviewDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReviewDTO> updateReview(@PathVariable Long id,
                                                  @RequestBody ReviewDTO reviewDTO,
                                                  @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        ReviewDTO updatedReview = reviewService.updateReview(id, reviewDTO, userId);
        return ResponseEntity.ok(updatedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        Long userId = jwtUtil.getId(token);

        reviewService.deleteReview(id, userId);
        return ResponseEntity.noContent().build();
    }
}
