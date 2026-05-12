package com.local_events.repository;

import com.local_events.entity.Event;
import com.local_events.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findAllByUserId(Long userId);

    @Query("SELECT e FROM Event e WHERE e.status = :status AND " +
            "(e.date > CURRENT_DATE OR (e.date = CURRENT_DATE AND e.time > CURRENT_TIME)) " +
            "ORDER BY e.date ASC, e.time ASC")
    List<Event> findUpcomingEventsByStatus(@Param("status") EventStatus status);

    @Query("""
        SELECT e FROM Event e 
        WHERE e.status = :status 
        AND (e.date > CURRENT_DATE OR (e.date = CURRENT_DATE AND e.time > CURRENT_TIME)) 
        ORDER BY e.occupiedSeats DESC, e.date ASC, e.time ASC
        FETCH FIRST 1 ROWS ONLY
    """)
    Optional<Event> findMostPopularUpcomingEvent(@Param("status") EventStatus status);
}