package com.radilens.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GradCamResponse {

    @JsonProperty("heatmap_base64")
    private String heatmapBase64;
    
    private String prediction;
    private double confidence;
    
    @JsonProperty("rale_score")
    private int raleScore;
    
    private String severity;

    public GradCamResponse() {}

    public String getHeatmapBase64() { return heatmapBase64; }
    public void setHeatmapBase64(String heatmapBase64) { this.heatmapBase64 = heatmapBase64; }

    public String getPrediction() { return prediction; }
    public void setPrediction(String prediction) { this.prediction = prediction; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    
    public int getRaleScore() { return raleScore; }
    public void setRaleScore(int raleScore) { this.raleScore = raleScore; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
