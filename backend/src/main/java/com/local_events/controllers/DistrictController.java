package com.local_events.controllers;

import com.local_events.dto.DistrictDTO;
import com.local_events.services.DistrictService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
@RequiredArgsConstructor
public class DistrictController {

    private final DistrictService districtService;

    @GetMapping
    public ResponseEntity<List<DistrictDTO>> getAllDistricts() {
        List<DistrictDTO> districts = districtService.getAllDistricts();

        if (districts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(districts);
    }

    @PostMapping
    public ResponseEntity<DistrictDTO> createDistrict(@RequestBody DistrictDTO dto) {
        System.out.println("Create district: " + dto.getName());

        DistrictDTO saved = districtService.createDistrict(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDistrict(@PathVariable Long id) {
        System.out.println("Delete district id: " + id);

        districtService.deleteDistrict(id);
        return ResponseEntity.noContent().build();
    }
}
