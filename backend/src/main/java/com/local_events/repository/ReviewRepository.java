package com.local_events.repository;

import com.local_events.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByEventId(Long eventId);

    @Query("SELECT COUNT(r) > 0 FROM Review r WHERE r.user.id = :userId AND r.eventId = :eventId AND r.rating > 0")
    boolean hasUserAlreadyReviewedEvent(@Param("userId") Long userId, @Param("eventId") Long eventId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.user.id = :userId AND r.eventId = :eventId AND r.rating = 0 AND r.parentId IS NULL")
    long countUserQuestionsForEvent(@Param("userId") Long userId, @Param("eventId") Long eventId);
}