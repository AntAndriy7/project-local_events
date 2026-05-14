package com.local_events.mapper;

import com.local_events.dto.EventDTO;
import com.local_events.entity.FavoriteEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface FavoriteEventMapper {
    FavoriteEventMapper INSTANCE = Mappers.getMapper(FavoriteEventMapper.class);

    @Mapping(source = "event.id", target = "id")
    @Mapping(source = "event.title", target = "title")
    @Mapping(source = "event.description", target = "description")
    @Mapping(source = "event.date", target = "date")
    @Mapping(source = "event.time", target = "time")
    @Mapping(source = "event.userId", target = "userId")
    @Mapping(source = "event.categoryId", target = "categoryId")
    @Mapping(source = "event.districtId", target = "districtId")
    @Mapping(source = "event.capacity", target = "capacity")
    @Mapping(source = "event.occupiedSeats", target = "occupiedSeats")
    @Mapping(source = "event.status", target = "status")
    @Mapping(source = "event.imageUrl", target = "imageUrl")
    @Mapping(constant = "true", target = "favorite")
    EventDTO toEventDTO(FavoriteEvent favoriteEvent);
}
