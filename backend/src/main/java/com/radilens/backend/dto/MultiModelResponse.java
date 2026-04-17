package com.radilens.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class MultiModelResponse {

    private List<ModelResult> models;
    
    @JsonProperty("primary_result")
    private PredictionResponse primaryResult;
    
    private String consensus;
    
    @JsonProperty("image_size")
    private List<Integer> imageSize;

    public MultiModelResponse() {}

    public List<ModelResult> getModels() { return models; }
    public void setModels(List<ModelResult> models) { this.models = models; }

    public PredictionResponse getPrimaryResult() { return primaryResult; }
    public void setPrimaryResult(PredictionResponse primaryResult) { this.primaryResult = primaryResult; }

    public String getConsensus() { return consensus; }
    public void setConsensus(String consensus) { this.consensus = consensus; }

    public List<Integer> getImageSize() { return imageSize; }
    public void setImageSize(List<Integer> imageSize) { this.imageSize = imageSize; }
}
