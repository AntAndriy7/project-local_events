package com.local_events.services;

import com.local_events.dto.ReviewCreateDTO;
import com.local_events.dto.ReviewDTO;
import com.local_events.entity.Event;
import com.local_events.entity.Review;
import com.local_events.entity.User;
import com.local_events.mapper.ReviewMapper;
import com.local_events.repository.EventRepository;
import com.local_events.repository.ReviewRepository;
import com.local_events.repository.TicketRepository;
import com.local_events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    private final ReviewMapper mapper = ReviewMapper.INSTANCE;

    public List<ReviewDTO> getReviewsByEventId(Long eventId) {
        List<Review> allReviews = reviewRepository.findByEventId(eventId);

        List<ReviewDTO> allDTOs = allReviews.stream()
                .map(mapper::toDTO)
                .toList();

        Map<Long, String> userNameMap = allDTOs.stream()
                .collect(Collectors.toMap(ReviewDTO::getId, ReviewDTO::getUserName));

        for (ReviewDTO dto : allDTOs) {
            if (dto.getReplyToId() != null) {
                dto.setReplyToUserName(userNameMap.get(dto.getReplyToId()));
            }
        }

        return allDTOs;
    }

    @Transactional
    public ReviewDTO createReview(ReviewCreateDTO dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        // Захист від маніпуляцій з рейтингом
        if (dto.getRating() > 0) {
            // Перевіряємо, чи подія вже почалася/пройшла
            LocalDateTime eventDateTime = event.getDate().atTime(event.getTime());
            if (eventDateTime.isAfter(LocalDateTime.now())) {
                throw new IllegalStateException("You cannot leave a review for an event that has not yet taken place.");
            }

            // Перевіряємо, чи був у користувача квиток на цю подію
            boolean hasTicket = ticketRepository.existsByUserIdAndEventId(userId, event.getId());
            if (!hasTicket) {
                throw new IllegalStateException("You can only leave a review for events you attended.");
            }
        }

        Review review = new Review();
        review.setUser(user);
        review.setEventId(dto.getEventId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedDate(LocalDate.now());
        review.setCreatedTime(LocalTime.now());

        if (dto.getParentId() != null) {
            Review parentReview = reviewRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new IllegalArgumentException("The comment you are replying to was not found."));

            if (!parentReview.getEventId().equals(dto.getEventId())) {
                throw new IllegalArgumentException("The answer must belong to the same event");
            }

            review.setParentId(dto.getParentId());

            if (dto.getReplyToId() != null) {
                // Зберігаємо, кому конкретно відповідаємо
                review.setReplyToId(dto.getReplyToId());
            }
        }

        Review savedReview = reviewRepository.save(review);
        return mapper.toDTO(savedReview);
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + reviewId));

        if (!review.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You can delete only your own review");
        }

        reviewRepository.delete(review);
    }
}
