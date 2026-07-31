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
public class ProductionOverviewDto {
    private int targetUnits;
    private int actualUnits;
    private int scrapUnits;
    private double yieldRate; // percentage
    private double defectRate; // percentage
    private double throughputPerHour;
    private List<Map<String, Object>> hourlyOutputTrend; // [{hour: "08:00", target: 120, actual: 118}, ...]
    private List<Map<String, Object>> defectCategoryBreakdown; // [{category: "Surface Scratch", count: 14}, ...]
}
