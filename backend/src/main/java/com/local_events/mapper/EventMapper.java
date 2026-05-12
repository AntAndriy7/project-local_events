package com.local_events.mapper;

import com.local_events.dto.EventCreateDTO;
import com.local_events.dto.EventDTO;
import com.local_events.entity.Event;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface EventMapper {
    EventMapper INSTANCE = Mappers.getMapper(EventMapper.class);

    EventDTO toDTO(Event event);
    Event toEntity(EventDTO eventDTO);

    Event toEntity(EventCreateDTO eventCreateDTO);
}
