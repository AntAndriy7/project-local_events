package com.local_events.services;

import com.local_events.entity.Event;
import com.local_events.entity.EventStatus;
import com.local_events.entity.TicketStatus;
import com.local_events.repository.EventRepository;
import com.local_events.repository.TicketRepository;
import com.local_events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EventCompletionService {

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    private static final String ARCHIVED_EVENT_IMAGE_URL = "https://res.cloudinary.com/local-events/image/upload/v1769784742/blackWhite_wb5krq.jpg";

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void processCompletedEvents() {
        LocalDate currentDate = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        List<Event> completedEvents = eventRepository.findEventsToComplete(currentDate, currentTime);

        for (Event event : completedEvents) {
            Long eventId = event.getId();

            List<Long> userIdsToUpdate = ticketRepository.findUserIdsByEventIdAndStatus(eventId, TicketStatus.RESERVED);

            if (!userIdsToUpdate.isEmpty()) {
                ticketRepository.updateTicketStatusesForEvent(eventId, TicketStatus.RESERVED, TicketStatus.EXPIRED);
                userRepository.incrementEventsVisitedCountForUsers(userIdsToUpdate);

                log.info("Event ID {}: Ticket status updated and counter increased for {} users.", eventId, userIdsToUpdate.size());
            }

            event.setStatus(EventStatus.COMPLETED);
            eventRepository.save(event);
        }
    }

    @Scheduled(cron = "0 0 3 * * *")
    @Transactional
    public void cleanupOldEventImages() {
        LocalDate oneMonthAgo = LocalDate.now().minusMonths(1);

        List<Event> eventsForCleanup = eventRepository.findOldEventsForArchivation(oneMonthAgo, ARCHIVED_EVENT_IMAGE_URL);

        if (eventsForCleanup.isEmpty()) {
            return;
        }

        for (Event event : eventsForCleanup) {
            String oldImageUrl = event.getImageUrl();

            cloudinaryService.deleteImageByUrl(oldImageUrl);
            event.setImageUrl(ARCHIVED_EVENT_IMAGE_URL);

            log.info("Event ID {} archived: original photo deleted, stub set.", event.getId());
        }

        eventRepository.saveAll(eventsForCleanup);
    }
}