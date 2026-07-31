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
public class EnergyConsumptionDto {
    private double currentKwh;
    private double dailyKwhTotal;
    private double costTodayUsd;
    private double efficiencyKwhPerUnit;
    private double peakDemandMw;
    private double carbonFootprintKg;
    private boolean peakWarning;
    private String energyRating; // A+, A, B
    private List<Map<String, Object>> hourlyUsageTrend;
    private List<Map<String, Object>> lineEnergyBreakdown;
}
