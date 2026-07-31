package com.intellisphere.server.modules.manufacturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManufacturingDashboardDto {
    private FactoryOverviewDto factoryOverview;
    private List<MachineStatusDto> machines;
    private ProductionOverviewDto productionOverview;
    private ShiftPerformanceDto shiftPerformance;
    private EnergyConsumptionDto energyConsumption;
    private MaintenanceOverviewDto maintenanceOverview;
    private List<AIRecommendationDto> aiRecommendations;
    private List<ManufacturingAlertDto> alerts;
    private List<ActivityLogDto> recentActivities;
}
