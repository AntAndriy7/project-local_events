package com.local_events.services;

import com.local_events.auth.JwtUtil;
import com.local_events.dto.*;
import com.local_events.entity.Event;
import com.local_events.entity.Ticket;
import com.local_events.entity.TicketStatus;
import com.local_events.mapper.TicketMapper;
import com.local_events.repository.EventRepository;
import com.local_events.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final UserService userService;
    private final EventService eventService;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final TicketMapper mapper = TicketMapper.INSTANCE;

    public Map<String, Object> getTicketsByEvent(Long eventId) {

        // 1. Перевірка, що подія існує
        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Event not found");
        }

        // 2. Отримуємо квитки
        List<Ticket> tickets = ticketRepository.findAllByEventId(eventId);

        if (tickets.isEmpty()) {
            return Map.of(
                    "tickets", List.of(),
                    "users", List.of()
            );
        }

        // 3. Ticket -> TicketDTO
        List<TicketDTO> ticketDTOs = tickets.stream()
                .map(mapper::toDTO)
                .toList();

        // 4. Збираємо user_id
        Set<Long> userIdSet = tickets.stream()
                .map(Ticket::getUser_id)
                .collect(Collectors.toSet());

        // 5. Отримуємо користувачів
        List<UserDTO> users = userService.getUsersByIds(userIdSet);

        // 6. Формуємо відповідь
        Map<String, Object> result = new HashMap<>();
        result.put("tickets", ticketDTOs);
        result.put("users", users);

        return result;
    }

    public Map<String, Object> getTicketsByUserId(Long userId) {

        List<Ticket> tickets = ticketRepository.findAllByUserId(userId);

        if (tickets.isEmpty()) {
            return Map.of(
                    "tickets", List.of(),
                    "events", List.of(),
                    "districts", List.of(),
                    "categories", List.of()
            );
        }

        List<TicketDTO> ticketDTOs = tickets.stream()
                .map(mapper::toDTO)
                .toList();

        Set<Long> eventIds = tickets.stream()
                .map(Ticket::getEvent_id)
                .collect(Collectors.toSet());

        Map<String, Object> eventDetails = eventService.getEventsWithDetailsByIds(eventIds);

        Map<String, Object> result = new HashMap<>();
        result.put("tickets", ticketDTOs);
        result.putAll(eventDetails);

        return result;
    }

    public TicketDTO reserveTicket(TicketRequestDTO dto, Long userId) {

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (event.getOccupied_seats() + dto.getQuantity() > event.getCapacity()) {
            throw new IllegalStateException("Not enough available seats");
        }

        if (ticketRepository.existsActiveReservation(userId, event.getId())) {
            throw new IllegalStateException("Already reserved");
        }

        Ticket ticket = new Ticket();
        ticket.setUser_id(userId);
        ticket.setEvent_id(event.getId());
        ticket.setQuantity(dto.getQuantity());
        ticket.setStatus(TicketStatus.RESERVED);
        ticket.setCreated_at(new Date(System.currentTimeMillis()));

        event.setOccupied_seats(event.getOccupied_seats() + dto.getQuantity());

        ticketRepository.save(ticket);
        eventRepository.save(event);

        return mapper.toDTO(ticket);
    }

    public void cancelReservation(Long ticketId, Long userId) {

        Ticket ticket = ticketRepository.findTicket(ticketId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        if (ticket.getStatus() == TicketStatus.CANCELED) {
            throw new IllegalStateException("Ticket is already canceled");
        }

        if (ticket.getStatus() != TicketStatus.RESERVED) {
            throw new IllegalStateException("Ticket cannot be canceled in current status");
        }

        Event event = eventRepository.findById(ticket.getEvent_id())
                .orElseThrow();

        Date now = new Date(System.currentTimeMillis());
        if (event.getDate().before(now)) {
            throw new IllegalStateException("Cannot cancel ticket after event start");
        }

        ticket.setStatus(TicketStatus.CANCELED);
        event.setOccupied_seats(event.getOccupied_seats() - ticket.getQuantity());

        ticketRepository.save(ticket);
        eventRepository.save(event);
    }
}
