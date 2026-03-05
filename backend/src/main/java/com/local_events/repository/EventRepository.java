package com.local_events.repository;

import com.local_events.entity.Event;
import com.local_events.entity.EventStatus;
import com.local_events.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query("SELECT e FROM Event e WHERE e.user_id = :userId")
    List<Event> findAllByUserId(Long userId);
    //List<Event> findAllByStatus(EventStatus status);
    @Query("SELECT e FROM Event e WHERE e.status = :status AND " +
            "(e.date > CURRENT_DATE OR (e.date = CURRENT_DATE AND e.time > CURRENT_TIME))")
    List<Event> findUpcomingEventsByStatus(@Param("status") EventStatus status);
}
