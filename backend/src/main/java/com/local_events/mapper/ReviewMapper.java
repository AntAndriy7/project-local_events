package com.local_events.mapper;

import com.local_events.dto.ReviewDTO;
import com.local_events.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ReviewMapper {
    ReviewMapper INSTANCE = Mappers.getMapper(ReviewMapper.class);

    @Mapping(source = "user.id", target = "user_id")
    @Mapping(source = "user.user_name", target = "userName")
    ReviewDTO toDTO(Review review);
    Review toEntity(ReviewDTO reviewDTO);
}
