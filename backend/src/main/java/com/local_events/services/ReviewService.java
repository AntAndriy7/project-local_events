package com.local_events.services;

import com.local_events.dto.ReviewDTO;
import com.local_events.entity.Review;
import com.local_events.entity.User;
import com.local_events.mapper.ReviewMapper;
import com.local_events.repository.ReviewRepository;
import com.local_events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    private final ReviewMapper mapper = ReviewMapper.INSTANCE;

    public List<ReviewDTO> getReviewsByEventId(Long eventId) {
        return reviewRepository.findByEventId(eventId)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public List<ReviewDTO> getReviewsByEventIds(Set<Long> eventIds) {
        return reviewRepository.findByEventIds(eventIds)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public ReviewDTO createReview(ReviewDTO reviewDTO, Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Review review = new Review();

        review.setUser(user);

        review.setEvent_id(reviewDTO.getEvent_id());
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());

        review.setCreated_date(new Date(System.currentTimeMillis()));
        review.setCreated_time(new Time(System.currentTimeMillis()));

        Review savedReview = reviewRepository.save(review);
        return mapper.toDTO(savedReview);
    }

    public ReviewDTO updateReview(Long id, ReviewDTO reviewDTO, Long userId) {

        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        if (!review.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You can update only your own review");
        }

        if (1 <= reviewDTO.getRating() && reviewDTO.getRating() <= 5) {
            review.setRating(reviewDTO.getRating());
        }

        if (reviewDTO.getComment() != null) {
            review.setComment(reviewDTO.getComment());
        }

        Review updatedReview = reviewRepository.save(review);
        return mapper.toDTO(updatedReview);
    }

    public void deleteReview(Long reviewId, Long userId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        if (!review.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You can delete only your own review");
        }

        reviewRepository.delete(review);
    }
}
