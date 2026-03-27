package com.local_events.services;

import com.local_events.dto.EventDTO;
import com.local_events.dto.ReviewDTO;
import com.local_events.dto.DistrictDTO;
import com.local_events.dto.CategoryDTO;
import com.local_events.entity.Event;
import com.local_events.entity.EventStatus;
import com.local_events.mapper.EventMapper;
import com.local_events.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final ReviewService reviewService;
    private final EventRepository eventRepository;
    private final DistrictService districtService;
    private final CategoryService categoryService;
    private final EventMapper mapper = EventMapper.INSTANCE;

    public Map<String, Object> getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        EventDTO eventDTO = mapper.toDTO(event);

        Long districtId = eventDTO.getDistrict_id();
        Long categoryId = eventDTO.getCategory_id();

        DistrictDTO district = districtService.getDistrictById(districtId);
        CategoryDTO category = categoryService.getCategoryById(categoryId);

        List<ReviewDTO> reviews = reviewService.getReviewsByEventId(eventDTO.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("event", eventDTO);
        result.put("reviews", reviews);
        result.put("district", district);
        result.put("category", category);

        return result;
    }

    public Map<String, Object> getPopularEvent() {
        Event popularEventOpt = eventRepository.findMostPopularUpcomingEvent(EventStatus.APPROVED);
        //TODD: new IllegalArgumentException("Event not found"));

        EventDTO eventDTO = mapper.toDTO(popularEventOpt);

        DistrictDTO district = districtService.getDistrictById(eventDTO.getDistrict_id());
        CategoryDTO category = categoryService.getCategoryById(eventDTO.getCategory_id());

        Map<String, Object> result = new HashMap<>();
        result.put("event", eventDTO);
        result.put("district", district);
        result.put("category", category);

        return result;
    }

    public Map<String, Object> getAllAvailableEvents() {

        //List<Event> events = eventRepository.findAllByStatus(EventStatus.APPROVED);
        List<Event> events = eventRepository.findUpcomingEventsByStatus(EventStatus.APPROVED);

        if (events.isEmpty()) return Map.of("events", List.of());

        List<EventDTO> eventDTOs = events.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());

        Set<Long> districtIdSet = events.stream()
                .map(Event::getDistrict_id)
                .collect(Collectors.toSet());

        Set<Long> categoriesIdSet = events.stream()
                .map(Event::getCategory_id)
                .collect(Collectors.toSet());

        List<DistrictDTO> districts = districtService.getDistrictsByIds(districtIdSet);
        List<CategoryDTO> categories = categoryService.getCategoriesByIds(categoriesIdSet);

        Map<String, Object> result = new HashMap<>();
        result.put("events", eventDTOs);
        result.put("districts", districts);
        result.put("categories", categories);

        return result;
    }

    public Map<String, Object> getAllEvents() {

        List<Event> events = eventRepository.findAll();

        if (events.isEmpty()) return Map.of("events", List.of());

        List<EventDTO> eventDTOs = events.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());

        Set<Long> districtIdSet = events.stream()
                .map(Event::getDistrict_id)
                .collect(Collectors.toSet());

        Set<Long> categoriesIdSet = events.stream()
                .map(Event::getCategory_id)
                .collect(Collectors.toSet());

        List<DistrictDTO> districts = districtService.getDistrictsByIds(districtIdSet);
        List<CategoryDTO> categories = categoryService.getCategoriesByIds(categoriesIdSet);

        Map<String, Object> result = new HashMap<>();
        result.put("events", eventDTOs);
        result.put("districts", districts);
        result.put("categories", categories);

        return result;
    }

    public Map<String, Object> getMyEvents(Long userId) {

        List<Event> events = eventRepository.findAllByUserId(userId);

        if (events.isEmpty()) return Map.of("events", List.of());

        List<EventDTO> eventDTOs = events.stream()
                .map(mapper::toDTO)
                .collect(Collectors.toList());

        Set<Long> districtIdSet = events.stream()
                .map(Event::getDistrict_id)
                .collect(Collectors.toSet());

        Set<Long> categoriesIdSet = events.stream()
                .map(Event::getCategory_id)
                .collect(Collectors.toSet());

        List<DistrictDTO> districts = districtService.getDistrictsByIds(districtIdSet);
        List<CategoryDTO> categories = categoryService.getCategoriesByIds(categoriesIdSet);

        Map<String, Object> result = new HashMap<>();
        result.put("events", eventDTOs);
        result.put("districts", districts);
        result.put("categories", categories);

        return result;
    }

    public Map<String, Object> getEventsWithDetailsByIds(Set<Long> eventIds) {
        if (eventIds == null || eventIds.isEmpty()) {
            return Map.of(
                    "events", List.of(),
                    "districts", List.of(),
                    "categories", List.of()
            );
        }

        List<Event> events = eventRepository.findAllById(eventIds);

        List<EventDTO> eventDTOs = events.stream()
                .map(mapper::toDTO)
                .toList();

        Set<Long> districtIds = events.stream()
                .map(Event::getDistrict_id)
                .collect(Collectors.toSet());

        Set<Long> categoryIds = events.stream()
                .map(Event::getCategory_id)
                .collect(Collectors.toSet());

        List<DistrictDTO> districts = districtService.getDistrictsByIds(districtIds);
        List<CategoryDTO> categories = categoryService.getCategoriesByIds(categoryIds);

        Map<String, Object> result = new HashMap<>();
        result.put("events", eventDTOs);
        result.put("districts", districts);
        result.put("categories", categories);

        return result;
    }

    public EventDTO createEvent(EventDTO eventDTO, Long userId) {
        String DEFAULT_EVENT_IMAGE_URL = "https://res.cloudinary.com/ddnykzohe/image/upload/v1769783138/default_pp6egj.jpg";

        Event event = new Event();

        event.setUser_id(userId);

        event.setTitle(eventDTO.getTitle());
        event.setDescription(eventDTO.getDescription());
        event.setCategory_id(eventDTO.getCategory_id());
        event.setDistrict_id(eventDTO.getDistrict_id());
        event.setDate(eventDTO.getDate());
        event.setTime(eventDTO.getTime());
        event.setCapacity(eventDTO.getCapacity());
        event.setStatus(EventStatus.PENDING);

        event.setImageUrl(
                eventDTO.getImageUrl() != null
                        ? eventDTO.getImageUrl()
                        : DEFAULT_EVENT_IMAGE_URL
        );


        Event savedEvent = eventRepository.save(event);
        return mapper.toDTO(savedEvent);
    }

    public EventDTO updateEvent(Long eventId, EventDTO dto, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

        if (!event.getUser_id().equals(userId)) {
            throw new AccessDeniedException("You can update only your own event");
        }

        // Оновлюємо тільки дозволені поля
        if (dto.getTitle() != null)
            event.setTitle(dto.getTitle());
        if (dto.getDescription() != null)
            event.setDescription(dto.getDescription());
        //event.setCategory_id(dto.getCategory_id());
        //event.setDistrict_id(dto.getDistrict_id());
        if (dto.getDate() != null)
            event.setDate(dto.getDate());
        if (dto.getTime() != null)
            event.setTime(dto.getTime());

        Event savedEvent = eventRepository.save(event);
        return mapper.toDTO(savedEvent);
    }

    public EventDTO updateEventStatus(Long eventId, EventStatus newStatus) {

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        event.setStatus(newStatus);

        Event savedEvent = eventRepository.save(event);
        return mapper.toDTO(savedEvent);
    }

    public void deleteEvent(Long eventId, Long userId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + eventId));

        if (!event.getUser_id().equals(userId)) {
            throw new AccessDeniedException("You can delete only your own event");
        }

        eventRepository.delete(event);
    }
}
