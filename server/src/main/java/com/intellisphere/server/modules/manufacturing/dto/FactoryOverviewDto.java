package com.intellisphere.server.modules.manufacturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FactoryOverviewDto {
    private String plantName;
    private String location;
    private String plantStatus;
    private double overallOee; // e.g. 88.4%
    private double availabilityScore; // 92.1%
    private double performanceScore; // 94.5%
    private double qualityScore; // 98.2%
    private int activeLinesCount;
    private int totalLinesCount;
    private int activeMachinesCount;
    private int totalMachinesCount;
    private int activeWorkersCount;
    private double dailyOutputTarget;
    private double currentDailyOutput;
    private double targetCompletionPercentage;
    private List<Map<String, Object>> productionLines;
}
