package com.local_events.controllers;

import com.local_events.services.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @GetMapping("/signature")
    public ResponseEntity<Map<String, Object>> getSignature() {
        return ResponseEntity.ok(cloudinaryService.generateSignature());
    }
}