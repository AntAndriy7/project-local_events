package com.local_events.controllers;

import com.local_events.dto.DistrictDTO;
import com.local_events.services.DistrictService;
import lombok.RequiredArgsConstructor;
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
        return ResponseEntity.ok(districtService.getAllDistricts());
    }
}
