package com.radilens.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PredictionResponse {

    private String prediction;
    private double confidence;
    private String model;

    @JsonProperty("inference_time_ms")
    private double inferenceTimeMs;
    
    @JsonProperty("rale_score")
    private int raleScore;
    
    private String severity;

    public PredictionResponse() {}

    public String getPrediction() { return prediction; }
    public void setPrediction(String prediction) { this.prediction = prediction; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public double getInferenceTimeMs() { return inferenceTimeMs; }
    public void setInferenceTimeMs(double inferenceTimeMs) { this.inferenceTimeMs = inferenceTimeMs; }
    
    public int getRaleScore() { return raleScore; }
    public void setRaleScore(int raleScore) { this.raleScore = raleScore; }
    
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
