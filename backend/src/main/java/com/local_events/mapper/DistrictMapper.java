package com.local_events.mapper;

import com.local_events.dto.DistrictDTO;
import com.local_events.entity.District;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DistrictMapper {
    DistrictMapper INSTANCE = Mappers.getMapper(DistrictMapper.class);

    DistrictDTO toDTO(District district);
    District toEntity(DistrictDTO districtDTO);
}
