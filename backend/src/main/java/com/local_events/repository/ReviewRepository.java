package com.local_events.repository;

import com.local_events.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT r FROM Review r WHERE r.event_id IN :eventId")
    List<Review> findByEventId(@Param("eventId") Long eventId);
    @Query("SELECT r FROM Review r WHERE r.event_id IN :eventIds")
    List<Review> findByEventIds(@Param("eventIds") Set<Long> eventIds);
}
