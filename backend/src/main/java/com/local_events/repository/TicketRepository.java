package com.local_events.repository;

import com.local_events.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    @Query("SELECT t FROM Ticket t WHERE t.event_id = :eventId AND t.status = 'RESERVED'")
    List<Ticket> findAllByEventId(@Param("eventId") Long eventId);

    @Query("SELECT t FROM Ticket t WHERE t.id = :id AND t.user_id = :userId")
    Optional<Ticket> findTicket(@Param("id") Long id, @Param("userId") Long userId);

    @Query("""
        SELECT COUNT(t) > 0 FROM Ticket t
        WHERE t.user_id = :userId
          AND t.event_id = :eventId
          AND t.status = 'RESERVED'
    """)
    boolean existsActiveReservation(
            @Param("userId") Long userId,
            @Param("eventId") Long eventId
    );
}
