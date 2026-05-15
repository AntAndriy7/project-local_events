package com.local_events.services;

import com.local_events.dto.*;
import com.local_events.entity.Event;
import com.local_events.entity.EventStatus;
import com.local_events.mapper.EventMapper;
import com.local_events.repository.EventRepository;
import com.local_events.repository.FavoriteEventRepository;
import com.local_events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final ReviewService reviewService;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final DistrictService districtService;
    private final CategoryService categoryService;
    private final FavoriteEventRepository favoriteRepository;
    private final EventMapper mapper = EventMapper.INSTANCE;

    public EventDetailedResponse getEventById(Long id, Long userId) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        EventCardResponse baseData = buildEventResponse(event, userId);

        List<ReviewDTO> reviews = reviewService.getReviewsByEventId(id);

        return new EventDetailedResponse(
                baseData.getEvent(),
                baseData.getDistrict(),
                baseData.getCategory(),
                reviews
        );
    }

    public EventCardResponse getPopularEvent() {
        Event popularEvent = eventRepository.findMostPopularUpcomingEvent(EventStatus.APPROVED)
                .orElseThrow(() -> new IllegalArgumentException("Popular event not found"));

        return buildEventResponse(popularEvent, null);
    }

    public EventListResponse getAllAvailableEvents(Long userId) {
        List<Event> events = eventRepository.findUpcomingEventsByStatus(EventStatus.APPROVED);
        return buildEventListResponse(events, userId);
    }

    public EventListResponse getAllEvents() {
        List<Event> events = eventRepository.findAll();
        return buildEventListResponse(events, null);
    }

    public EventListResponse getMyEvents(Long userId) {
        List<Event> events = eventRepository.findAllByUserId(userId);
        return buildEventListResponse(events, null);
    }

    public EventListResponse getEventsWithDetailsByIds(Set<Long> eventIds) {
        if (eventIds == null || eventIds.isEmpty()) {
            return new EventListResponse(List.of(), List.of(), List.of());
        }

        List<Event> events = eventRepository.findAllById(eventIds);

        return buildEventListResponse(events, null);
    }

    public EventDTO createEvent(EventCreateDTO eventDTO, Long userId) {
        String DEFAULT_EVENT_IMAGE_URL = "https://res.cloudinary.com/local-events/image/upload/v1769783138/default_pp6egj.jpg";
        validateEventCreateData(eventDTO);

        Event event = mapper.toEntity(eventDTO);

        event.setUserId(userId);
        event.setStatus(EventStatus.PENDING);
        event.setOccupiedSeats(0);

        event.setImageUrl(
                eventDTO.getImageUrl() != null && !eventDTO.getImageUrl().trim().isEmpty()
                        ? eventDTO.getImageUrl()
                        : DEFAULT_EVENT_IMAGE_URL
        );

        Event savedEvent = eventRepository.save(event);
        return mapper.toDTO(savedEvent);
    }

    @Transactional
    public EventDTO updateEventStatus(Long eventId, EventStatus newStatus) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        boolean isNewlyApproved = (newStatus == EventStatus.APPROVED)
                && (event.getStatus() != EventStatus.APPROVED);

        event.setStatus(newStatus);
        Event savedEvent = eventRepository.save(event);

        if (isNewlyApproved) {
            userRepository.incrementEventsCreatedCount(event.getUserId());
        }

        return mapper.toDTO(savedEvent);
    }

    private EventCardResponse buildEventResponse(Event event, Long userId) {
        EventDTO eventDTO = mapper.toDTO(event);
        if (userId != null) {
            eventDTO.setFavorite(favoriteRepository.existsByUserIdAndEventId(userId, event.getId()));
        }
        DistrictDTO district = districtService.getDistrictById(event.getDistrictId());
        CategoryDTO category = categoryService.getCategoryById(event.getCategoryId());

        return new EventCardResponse(eventDTO, district, category);
    }

    private EventListResponse buildEventListResponse(List<Event> events, Long userId) {
        if (events.isEmpty()) {
            return new EventListResponse(List.of(), List.of(), List.of());
        }

        Set<Long> favoriteIds = (userId != null)
                ? favoriteRepository.findAllFavoriteEventIdsByUserId(userId)
                : Set.of();

        List<EventDTO> eventDTOs = events.stream()
                .map(event -> {
                    EventDTO dto = mapper.toDTO(event);
                    dto.setFavorite(favoriteIds.contains(event.getId())); // Проставляємо статус
                    return dto;
                })
                .toList();

        Set<Long> districtIds = events.stream()
                .map(Event::getDistrictId)
                .collect(Collectors.toSet());

        Set<Long> categoryIds = events.stream()
                .map(Event::getCategoryId)
                .collect(Collectors.toSet());

        List<DistrictDTO> districts = districtService.getDistrictsByIds(districtIds);
        List<CategoryDTO> categories = categoryService.getCategoriesByIds(categoryIds);

        return new EventListResponse(eventDTOs, districts, categories);
    }

    private void validateEventCreateData(EventCreateDTO dto) {
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Event name cannot be empty.");
        }
        if (dto.getDescription() == null || dto.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Event description cannot be empty.");
        }
        if (dto.getDate() == null) {
            throw new IllegalArgumentException("Date is required");
        }
        if (dto.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("The event date cannot be in the past.");
        }
        if (dto.getTime() == null) {
            throw new IllegalArgumentException("Time is required");
        }
        if (dto.getCapacity() < 1) {
            throw new IllegalArgumentException("Capacity must be at least 1");
        }
        if (dto.getCategoryId() == null) {
            throw new IllegalArgumentException("Category is required");
        }
        if (dto.getDistrictId() == null) {
            throw new IllegalArgumentException("District is required");
        }
    }
}
