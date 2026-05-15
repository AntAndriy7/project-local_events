package com.local_events.repository;

import com.local_events.entity.Event;
import com.local_events.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
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

    @Query("SELECT e FROM Event e WHERE e.status = 'APPROVED' AND (e.date < :currentDate OR (e.date = :currentDate AND e.time <= :currentTime))")
    List<Event> findEventsToComplete(@Param("currentDate") LocalDate currentDate, @Param("currentTime") LocalTime currentTime);

    @Query("SELECT e FROM Event e WHERE e.status = 'COMPLETED' AND e.date <= :targetDate AND e.imageUrl IS NOT NULL AND e.imageUrl != :archivedImageUrl")
    List<Event> findOldEventsForArchivation(@Param("targetDate") LocalDate targetDate, @Param("archivedImageUrl") String archivedImageUrl);
}