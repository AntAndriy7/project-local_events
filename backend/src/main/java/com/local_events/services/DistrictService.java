package com.local_events.services;

import com.local_events.dto.DistrictDTO;
import com.local_events.entity.District;
import com.local_events.mapper.DistrictMapper;
import com.local_events.repository.DistrictRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DistrictService {

    private final DistrictRepository districtRepository;
    private final DistrictMapper mapper = DistrictMapper.INSTANCE;

    public List<DistrictDTO> getAllDistricts() {
        return districtRepository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    public DistrictDTO getDistrictById(Long id) {
        District district = districtRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("District not found"));

        return mapper.toDTO(district);
    }

    public List<DistrictDTO> getDistrictsByIds(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        return districtRepository.findByIdIn(ids)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }
}
