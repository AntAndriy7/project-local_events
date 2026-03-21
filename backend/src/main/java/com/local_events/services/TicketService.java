package com.local_events.services;

import com.local_events.dto.*;
import com.local_events.entity.Event;
import com.local_events.entity.Ticket;
import com.local_events.entity.TicketStatus;
import com.local_events.mapper.TicketMapper;
import com.local_events.repository.EventRepository;
import com.local_events.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
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
        // 1. Отримуємо всі квитки користувача
        List<Ticket> tickets = ticketRepository.findAllByUserId(userId);

        if (tickets.isEmpty()) {
            return Map.of(
                    "tickets", List.of(),
                    "events", List.of(),
                    "districts", List.of(),
                    "categories", List.of()
            );
        }

        // 2. Збираємо ID подій і отримуємо їхні деталі
        Set<Long> eventIds = tickets.stream()
                .map(Ticket::getEvent_id)
                .collect(Collectors.toSet());

        Map<String, Object> eventDetails = eventService.getEventsWithDetailsByIds(eventIds);

        // Робимо Map подій для швидкого пошуку по ID (щоб не писати цикли в циклі)
        @SuppressWarnings("unchecked")
        List<EventDTO> eventDTOs = (List<EventDTO>) eventDetails.get("events");
        Map<Long, EventDTO> eventMap = eventDTOs.stream()
                .collect(Collectors.toMap(EventDTO::getId, e -> e));

        // 3. Підготовка до оновлення статусів
        List<Ticket> ticketsToUpdate = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        List<TicketDTO> ticketDTOs = tickets.stream()
                .map(ticket -> {
                    EventDTO event = eventMap.get(ticket.getEvent_id());

                    boolean isEventPassed = false;

                    // Перевіряємо і дату, і час, щоб квиток "згорів" щойно подія почалася
                    if (event != null && event.getDate() != null && event.getTime() != null) {
                        LocalDateTime eventDateTime = event.getDate().atTime(event.getTime());
                        isEventPassed = eventDateTime.isBefore(now);
                    }

                    // Якщо квиток зарезервований, а подія вже в минулому
                    if (ticket.getStatus() == TicketStatus.RESERVED && isEventPassed) {
                        ticket.setStatus(TicketStatus.EXPIRED);
                        ticketsToUpdate.add(ticket);
                    }

                    return mapper.toDTO(ticket);
                })
                .toList();

        if (!ticketsToUpdate.isEmpty()) {
            ticketRepository.saveAll(ticketsToUpdate);
        }

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
        ticket.setCreated_at(LocalDate.now());

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

        if (event.getDate().atTime(event.getTime()).isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot cancel ticket after event start");
        }

        ticket.setStatus(TicketStatus.CANCELED);
        event.setOccupied_seats(event.getOccupied_seats() - ticket.getQuantity());

        ticketRepository.save(ticket);
        eventRepository.save(event);
    }
}
