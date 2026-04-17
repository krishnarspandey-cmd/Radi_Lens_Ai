package com.radilens.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ModelResult {

    private String name;
    private String prediction;
    private double confidence;
    
    @JsonProperty("inference_time_ms")
    private double inferenceTimeMs;
    
    @JsonProperty("is_primary")
    private boolean primary;
    
    @JsonProperty("rale_score")
    private int raleScore;
    
    private String severity;

    public ModelResult() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPrediction() { return prediction; }
    public void setPrediction(String prediction) { this.prediction = prediction; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public double getInferenceTimeMs() { return inferenceTimeMs; }
    public void setInferenceTimeMs(double inferenceTimeMs) { this.inferenceTimeMs = inferenceTimeMs; }

    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean primary) { this.primary = primary; }
    
    public int getRaleScore() { return raleScore; }
    public void setRaleScore(int raleScore) { this.raleScore = raleScore; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
