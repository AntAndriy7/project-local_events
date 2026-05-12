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

    @Query("SELECT t FROM Ticket t WHERE t.eventId = :eventId AND t.status = 'RESERVED'")
    List<Ticket> findAllByEventId(@Param("eventId") Long eventId);

    Optional<Ticket> findByIdAndUserId(Long id, Long userId);

    @Query("""
        SELECT COUNT(t) > 0 FROM Ticket t
        WHERE t.userId = :userId
          AND t.eventId = :eventId
          AND t.status = 'RESERVED'
    """)
    boolean existsActiveReservation(
            @Param("userId") Long userId,
            @Param("eventId") Long eventId
    );

    List<Ticket> findAllByUserId(Long userId);

    boolean existsByUserIdAndEventId(Long userId, Long eventId);
}