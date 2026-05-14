package com.local_events.services;

import com.local_events.dto.EventDTO;
import com.local_events.entity.Event;
import com.local_events.entity.FavoriteEvent;
import com.local_events.entity.User;
import com.local_events.mapper.FavoriteEventMapper;
import com.local_events.repository.EventRepository;
import com.local_events.repository.FavoriteEventRepository;
import com.local_events.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoriteEventService {

    private final FavoriteEventRepository favoriteRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    @Transactional(readOnly = true)
    public List<EventDTO> getUserFavorites(Long userId) {
        return favoriteRepository.findAllByUserId(userId).stream()
                .map(FavoriteEventMapper.INSTANCE::toEventDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addToFavorite(Long userId, Long eventId) {
        if (!favoriteRepository.existsByUserIdAndEventId(userId, eventId)) {
            User user = userRepository.getReferenceById(userId);
            Event event = eventRepository.getReferenceById(eventId);

            FavoriteEvent favorite = new FavoriteEvent(user, event);
            favoriteRepository.save(favorite);
        }
    }

    @Transactional
    public void removeFromFavorite(Long userId, Long eventId) {
        favoriteRepository.deleteByUserIdAndEventId(userId, eventId);
    }
}
