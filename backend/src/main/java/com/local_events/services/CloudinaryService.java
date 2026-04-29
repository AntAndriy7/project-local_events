package com.local_events.services;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    public Map<String, Object> generateSignature() {
        long timestamp = System.currentTimeMillis() / 1000L;
        String folder = "events/users";

        Map<String, Object> paramsToSign = new HashMap<>();
        paramsToSign.put("timestamp", timestamp);
        paramsToSign.put("folder", folder);

        Cloudinary cloudinary = new Cloudinary();
        String signature = cloudinary.apiSignRequest(paramsToSign, apiSecret);

        Map<String, Object> response = new HashMap<>();
        response.put("signature", signature);
        response.put("timestamp", timestamp);
        response.put("folder", folder);
        response.put("apiKey", apiKey);

        return response;
    }
}