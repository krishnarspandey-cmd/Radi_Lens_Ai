package com.radilens.backend.controller;

import com.radilens.backend.dto.GradCamResponse;
import com.radilens.backend.dto.MultiModelResponse;
import com.radilens.backend.dto.PredictionResponse;
import com.radilens.backend.service.AiServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/v1")
public class AnalysisController {

    private static final Logger log = LoggerFactory.getLogger(AnalysisController.class);
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/jpg", "image/png");
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

    private final AiServiceClient aiServiceClient;

    public AnalysisController(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "RadiLens Backend"));
    }

    private ResponseEntity<?> validateFile(MultipartFile file) {
        if (file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Uploaded file is empty."));
        if (file.getSize() > MAX_FILE_SIZE) return ResponseEntity.badRequest().body(Map.of("error", "File too large."));
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid file type. Only JPEG and PNG are supported."));
        }
        return null;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyze(@RequestParam("file") MultipartFile file) {
        ResponseEntity<?> error = validateFile(file);
        if (error != null) return error;
        try {
            PredictionResponse prediction = aiServiceClient.predict(file);
            return ResponseEntity.ok(prediction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error."));
        }
    }

    @PostMapping(value = "/analyze-all", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> analyzeAll(@RequestParam("file") MultipartFile file) {
        ResponseEntity<?> error = validateFile(file);
        if (error != null) return error;
        try {
            MultiModelResponse prediction = aiServiceClient.predictAll(file);
            return ResponseEntity.ok(prediction);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error."));
        }
    }

    @PostMapping(value = "/gradcam", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> gradCam(@RequestParam("file") MultipartFile file) {
        ResponseEntity<?> error = validateFile(file);
        if (error != null) return error;
        try {
            GradCamResponse response = aiServiceClient.gradCam(file);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error."));
        }
    }
}
