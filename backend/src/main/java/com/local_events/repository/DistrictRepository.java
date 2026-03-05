package com.local_events.repository;

import com.local_events.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface DistrictRepository extends JpaRepository<District, Long> {
    List<District> findByIdIn(Set<Long> ids);
}
