package com.local_events.services;

import com.local_events.dto.*;
import com.local_events.dto.EventDTO;
import com.local_events.entity.Event;
import com.local_events.entity.Ticket;
import com.local_events.entity.TicketStatus;
import com.local_events.mapper.TicketMapper;
import com.local_events.repository.EventRepository;
import com.local_events.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public TicketListEventResponse getTicketsByEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Event not found");
        }

        List<Ticket> tickets = ticketRepository.findAllByEventId(eventId);

        if (tickets.isEmpty()) {
            return new TicketListEventResponse(List.of(), List.of());
        }

        List<TicketDTO> ticketDTOs = tickets.stream()
                .map(mapper::toDTO)
                .toList();

        Set<Long> userIdSet = tickets.stream()
                .map(Ticket::getUserId)
                .collect(Collectors.toSet());

        List<UserDTO> users = userService.getUsersByIds(userIdSet);

        return new TicketListEventResponse(ticketDTOs, users);
    }

    public TicketListResponse getTicketsByUserId(Long userId) {
        // 1. Отримуємо всі квитки користувача
        List<Ticket> tickets = ticketRepository.findAllByUserId(userId);

        if (tickets.isEmpty()) {
            return new TicketListResponse(List.of(), List.of(), List.of(), List.of());
        }

        // 2. Збираємо ID подій і отримуємо їхні деталі
        Set<Long> eventIds = tickets.stream()
                .map(Ticket::getEventId)
                .collect(Collectors.toSet());

        EventListResponse eventDetails = eventService.getEventsWithDetailsByIds(eventIds);

        Map<Long, EventDTO> eventMap = eventDetails.getEvents().stream()
                .collect(Collectors.toMap(EventDTO::getId, e -> e));

        // 3. Підготовка до оновлення статусів
        List<Ticket> ticketsToUpdate = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        for (Ticket ticket : tickets) {
            EventDTO event = eventMap.get(ticket.getEventId());

            if (event != null && event.getDate() != null && event.getTime() != null) {
                LocalDateTime eventDateTime = event.getDate().atTime(event.getTime());

                // Якщо квиток зарезервований, а подія вже почалася/минула
                if (ticket.getStatus() == TicketStatus.RESERVED && eventDateTime.isBefore(now)) {
                    ticket.setStatus(TicketStatus.EXPIRED);
                    ticketsToUpdate.add(ticket);
                }
            }
        }

        if (!ticketsToUpdate.isEmpty()) {
            ticketRepository.saveAll(ticketsToUpdate);
        }

        List<TicketDTO> ticketDTOs = tickets.stream()
                .map(mapper::toDTO)
                .toList();

        return new TicketListResponse(
                ticketDTOs,
                eventDetails.getEvents(),
                eventDetails.getDistricts(),
                eventDetails.getCategories()
        );
    }

    @Transactional
    public TicketDTO reserveTicket(TicketRequestDTO dto, Long userId) {
        // 1. Ручна валідація вхідних даних
        if (dto.getQuantity() <= 0) {
            throw new IllegalArgumentException("The number of tickets must be greater than 0");
        }

        Event event = eventRepository.findById(dto.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        // 2. Перевірка, чи подія ще не почалася
        if (event.getDate().atTime(event.getTime()).isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("You cannot book a ticket for an event that has already started or passed");
        }

        // 3. Перевірка місткості
        if (event.getOccupiedSeats() + dto.getQuantity() > event.getCapacity()) {
            throw new IllegalStateException("Not enough available seats");
        }

        // 4. Перевірка дублікатів
        if (ticketRepository.existsActiveReservation(userId, event.getId())) {
            throw new IllegalStateException("Already reserved");
        }

        Ticket ticket = new Ticket();
        ticket.setUserId(userId);
        ticket.setEventId(event.getId());
        ticket.setQuantity(dto.getQuantity());
        ticket.setStatus(TicketStatus.RESERVED);
        ticket.setCreatedAt(LocalDate.now());

        event.setOccupiedSeats(event.getOccupiedSeats() + dto.getQuantity());

        ticketRepository.save(ticket);
        // eventRepository.save(event); // @Transactional

        return mapper.toDTO(ticket);
    }

    @Transactional
    public void cancelReservation(Long ticketId, Long userId) {
        Ticket ticket = ticketRepository.findByIdAndUserId(ticketId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        if (ticket.getStatus() == TicketStatus.CANCELED) {
            throw new IllegalStateException("Ticket is already canceled");
        }

        if (ticket.getStatus() != TicketStatus.RESERVED) {
            throw new IllegalStateException("Ticket cannot be canceled in current status");
        }

        Event event = eventRepository.findById(ticket.getEventId())
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (event.getDate().atTime(event.getTime()).isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot cancel ticket after event start");
        }

        ticket.setStatus(TicketStatus.CANCELED);
        event.setOccupiedSeats(event.getOccupiedSeats() - ticket.getQuantity());
    }
}
