package com.intellisphere.server.modules.manufacturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIRecommendationDto {
    private String id;
    private String title;
    private String category; // PREDICTIVE_MAINTENANCE, ENERGY_SAVING, QUALITY_OPTIMIZATION, THROUGHPUT
    private String impact; // High, Medium, Low
    private String description;
    private String actionableStep;
    private double confidenceScore; // e.g. 94.8%
    private String estimatedSavings; // e.g. "$4,200/mo or 14% energy"
}
