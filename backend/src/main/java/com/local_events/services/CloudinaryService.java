package com.local_events.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

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

    public void deleteImageByUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) return;

        try {
            String publicId = extractPublicId(imageUrl);

            Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret));

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Deleting photos from Cloudinary ({}): {}", publicId, result.get("result"));

        } catch (Exception e) {
            log.error("Error deleting photo from Cloudinary for URL: {}", imageUrl, e);
        }
    }

    private String extractPublicId(String imageUrl) {
        int uploadIndex = imageUrl.indexOf("upload/");
        if (uploadIndex == -1) return imageUrl;

        String afterUpload = imageUrl.substring(uploadIndex + 7);
        int versionEndIndex = afterUpload.indexOf('/');

        String pathWithExtension = afterUpload.substring(versionEndIndex + 1);

        int lastDotIndex = pathWithExtension.lastIndexOf('.');
        if (lastDotIndex != -1) {
            return pathWithExtension.substring(0, lastDotIndex);
        }

        return pathWithExtension;
    }
}