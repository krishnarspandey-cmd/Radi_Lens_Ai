package com.radilens.backend.service;

import com.radilens.backend.dto.GradCamResponse;
import com.radilens.backend.dto.MultiModelResponse;
import com.radilens.backend.dto.PredictionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);
    private final RestTemplate restTemplate;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public AiServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpEntity<MultiValueMap<String, Object>> buildMultipartRequest(MultipartFile file) throws IOException {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        byte[] fileBytes = file.getBytes();
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
        ByteArrayResource fileResource = new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return originalFilename;
            }
        };
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", fileResource);
        return new HttpEntity<>(body, headers);
    }

    public PredictionResponse predict(MultipartFile file) throws IOException {
        String url = aiServiceUrl + "/predict";
        try {
            ResponseEntity<PredictionResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, buildMultipartRequest(file), PredictionResponse.class);
            return response.getBody();
        } catch (ResourceAccessException e) {
            throw new RuntimeException("AI service is unavailable at " + url);
        }
    }

    public MultiModelResponse predictAll(MultipartFile file) throws IOException {
        String url = aiServiceUrl + "/predict-all";
        try {
            ResponseEntity<MultiModelResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, buildMultipartRequest(file), MultiModelResponse.class);
            return response.getBody();
        } catch (ResourceAccessException e) {
            throw new RuntimeException("AI service is unavailable at " + url);
        }
    }

    public GradCamResponse gradCam(MultipartFile file) throws IOException {
        String url = aiServiceUrl + "/gradcam";
        try {
            ResponseEntity<GradCamResponse> response = restTemplate.exchange(
                    url, HttpMethod.POST, buildMultipartRequest(file), GradCamResponse.class);
            return response.getBody();
        } catch (ResourceAccessException e) {
            throw new RuntimeException("AI service is unavailable at " + url);
        }
    }
}
