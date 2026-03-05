package com.local_events.mapper;

import com.local_events.dto.CategoryDTO;
import com.local_events.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface CategoryMapper {
    CategoryMapper INSTANCE = Mappers.getMapper(CategoryMapper.class);

    CategoryDTO toDTO(Category category);
    Category toEntity(CategoryDTO categoryDTO);
}
