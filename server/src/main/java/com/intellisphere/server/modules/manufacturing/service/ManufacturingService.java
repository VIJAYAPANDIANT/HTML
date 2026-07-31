package com.intellisphere.server.modules.manufacturing.service;

import com.intellisphere.server.modules.ai.AIService;
import com.intellisphere.server.modules.manufacturing.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ManufacturingService {

    private final AIService aiService;

    @Autowired
    public ManufacturingService(AIService aiService) {
        this.aiService = aiService;
    }

    public ManufacturingDashboardDto getDashboardData() {
        // Factory Overview
        FactoryOverviewDto factoryOverview = FactoryOverviewDto.builder()
                .plantName("IntelliSphere Plant 01 - Detroit Hub")
                .location("Detroit, MI - USA")
                .plantStatus("OPERATIONAL")
                .overallOee(88.4)
                .availabilityScore(92.1)
                .performanceScore(94.5)
                .qualityScore(98.2)
                .activeLinesCount(4)
                .totalLinesCount(4)
                .activeMachinesCount(22)
                .totalMachinesCount(24)
                .activeWorkersCount(142)
                .dailyOutputTarget(12000.0)
                .currentDailyOutput(10850.0)
                .targetCompletionPercentage(90.4)
                .productionLines(List.of(
                        Map.of("id", "LINE-A", "name", "Line A - Stamping", "status", "OPERATIONAL", "target", 3000, "actual", 2890, "oee", 91.2),
                        Map.of("id", "LINE-B", "name", "Line B - Robotic Welding", "status", "DEGRADED", "target", 3000, "actual", 2540, "oee", 81.5),
                        Map.of("id", "LINE-C", "name", "Line C - Final Assembly", "status", "OPERATIONAL", "target", 4000, "actual", 3780, "oee", 89.8),
                        Map.of("id", "LINE-D", "name", "Line D - Quality Inspection", "status", "OPERATIONAL", "target", 2000, "actual", 1640, "oee", 94.0)
                ))
                .build();

        // Machine Telemetry Monitoring Data
        List<MachineStatusDto> machines = List.of(
                MachineStatusDto.builder()
                        .id(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                        .name("CNC Lathe Ultra 5X")
                        .machineCode("CNC-101")
                        .type("CNC Lathe")
                        .productionLine("Line A - Stamping")
                        .status("OPERATIONAL")
                        .healthScore(96)
                        .temperature(68.5)
                        .vibration(1.4)
                        .spindleSpeed(3200)
                        .hydraulicPressure(1450)
                        .ageMonths(14)
                        .lastMaintenance("2026-07-15")
                        .nextMaintenance("2026-08-15")
                        .failureRisk("Low (4.2%)")
                        .build(),
                MachineStatusDto.builder()
                        .id(UUID.fromString("22222222-2222-2222-2222-222222222222"))
                        .name("KUKA Robotic Weld-Arm 4")
                        .machineCode("WELD-204")
                        .type("Robotic Arm")
                        .productionLine("Line B - Robotic Welding")
                        .status("WARNING")
                        .healthScore(74)
                        .temperature(86.2)
                        .vibration(4.8)
                        .spindleSpeed(0)
                        .hydraulicPressure(1820)
                        .ageMonths(32)
                        .lastMaintenance("2026-06-10")
                        .nextMaintenance("2026-08-02")
                        .failureRisk("High (38.5%)")
                        .build(),
                MachineStatusDto.builder()
                        .id(UUID.fromString("33333333-3333-3333-3333-333333333333"))
                        .name("Schuler Stamping Press 500T")
                        .machineCode("PRESS-301")
                        .type("Stamping Press")
                        .productionLine("Line A - Stamping")
                        .status("CRITICAL")
                        .healthScore(52)
                        .temperature(94.8)
                        .vibration(7.2)
                        .spindleSpeed(1200)
                        .hydraulicPressure(2100)
                        .ageMonths(48)
                        .lastMaintenance("2026-05-20")
                        .nextMaintenance("2026-07-30")
                        .failureRisk("Severe (78.2%)")
                        .build(),
                MachineStatusDto.builder()
                        .id(UUID.fromString("44444444-4444-4444-4444-444444444444"))
                        .name("Bosch Rexroth Pump H2")
                        .machineCode("PUMP-402")
                        .type("Hydraulic Pump")
                        .productionLine("Line C - Final Assembly")
                        .status("MAINTENANCE")
                        .healthScore(60)
                        .temperature(72.0)
                        .vibration(2.1)
                        .spindleSpeed(1800)
                        .hydraulicPressure(1600)
                        .ageMonths(28)
                        .lastMaintenance("2026-07-31")
                        .nextMaintenance("2026-08-10")
                        .failureRisk("Medium (18.0%)")
                        .build(),
                MachineStatusDto.builder()
                        .id(UUID.fromString("55555555-5555-5555-5555-555555555555"))
                        .name("FlexLink Conveyor System C-3")
                        .machineCode("CONV-503")
                        .type("Conveyor Assembly")
                        .productionLine("Line C - Final Assembly")
                        .status("OPERATIONAL")
                        .healthScore(92)
                        .temperature(62.4)
                        .vibration(1.1)
                        .spindleSpeed(950)
                        .hydraulicPressure(850)
                        .ageMonths(18)
                        .lastMaintenance("2026-07-01")
                        .nextMaintenance("2026-09-01")
                        .failureRisk("Low (2.8%)")
                        .build()
        );

        // Production Overview
        ProductionOverviewDto productionOverview = ProductionOverviewDto.builder()
                .targetUnits(12000)
                .actualUnits(10850)
                .scrapUnits(195)
                .yieldRate(98.2)
                .defectRate(1.8)
                .throughputPerHour(1356.25)
                .hourlyOutputTrend(List.of(
                        Map.of("hour", "06:00", "target", 1500, "actual", 1480, "scrap", 12),
                        Map.of("hour", "08:00", "target", 1500, "actual", 1420, "scrap", 24),
                        Map.of("hour", "10:00", "target", 1500, "actual", 1310, "scrap", 42),
                        Map.of("hour", "12:00", "target", 1500, "actual", 1490, "scrap", 18),
                        Map.of("hour", "14:00", "target", 1500, "actual", 1380, "scrap", 31),
                        Map.of("hour", "16:00", "target", 1500, "actual", 1450, "scrap", 20),
                        Map.of("hour", "18:00", "target", 1500, "actual", 1180, "scrap", 38),
                        Map.of("hour", "20:00", "target", 1500, "actual", 1140, "scrap", 10)
                ))
                .defectCategoryBreakdown(List.of(
                        Map.of("category", "Welding Micro-Fissure", "count", 78, "percentage", 40.0),
                        Map.of("category", "Surface Scratch", "count", 45, "percentage", 23.0),
                        Map.of("category", "Dimensional Variance", "count", 38, "percentage", 19.5),
                        Map.of("category", "Stamping Burr", "count", 34, "percentage", 17.5)
                ))
                .build();

        // Shift Performance
        ShiftPerformanceDto shiftPerformance = ShiftPerformanceDto.builder()
                .currentShift("Shift 1 - Morning (06:00 - 14:00)")
                .activeSupervisor("Marcus Vance (Lead Engineer)")
                .currentShiftProgress(87.5)
                .shifts(List.of(
                        ShiftPerformanceDto.ShiftSummaryDto.builder()
                                .name("Shift 1 - Morning")
                                .supervisor("Marcus Vance")
                                .targetUnits(4500)
                                .actualUnits(4320)
                                .downtimeMinutes(22)
                                .oeePercentage(91.5)
                                .status("ACTIVE")
                                .build(),
                        ShiftPerformanceDto.ShiftSummaryDto.builder()
                                .name("Shift 2 - Afternoon")
                                .supervisor("Elena Rostova")
                                .targetUnits(4500)
                                .actualUnits(4180)
                                .downtimeMinutes(48)
                                .oeePercentage(86.2)
                                .status("UPCOMING")
                                .build(),
                        ShiftPerformanceDto.ShiftSummaryDto.builder()
                                .name("Shift 3 - Night")
                                .supervisor("David Kim")
                                .targetUnits(3000)
                                .actualUnits(2350)
                                .downtimeMinutes(75)
                                .oeePercentage(78.4)
                                .status("COMPLETED")
                                .build()
                ))
                .build();

        // Energy Consumption
        EnergyConsumptionDto energyConsumption = EnergyConsumptionDto.builder()
                .currentKwh(4250.8)
                .dailyKwhTotal(34200.0)
                .costTodayUsd(4104.0)
                .efficiencyKwhPerUnit(3.15)
                .peakDemandMw(4.8)
                .carbonFootprintKg(14250.0)
                .peakWarning(true)
                .energyRating("A- Class")
                .hourlyUsageTrend(List.of(
                        Map.of("time", "06:00", "kwh", 380, "cost", 45.6),
                        Map.of("time", "08:00", "kwh", 490, "cost", 58.8),
                        Map.of("time", "10:00", "kwh", 580, "cost", 69.6),
                        Map.of("time", "12:00", "kwh", 560, "cost", 67.2),
                        Map.of("time", "14:00", "kwh", 610, "cost", 73.2),
                        Map.of("time", "16:00", "kwh", 590, "cost", 70.8),
                        Map.of("time", "18:00", "kwh", 440, "cost", 52.8)
                ))
                .lineEnergyBreakdown(List.of(
                        Map.of("line", "Line A Stamping", "kwh", 12500, "share", 36.5),
                        Map.of("line", "Line B Welding", "kwh", 11200, "share", 32.7),
                        Map.of("line", "Line C Assembly", "kwh", 7800, "share", 22.8),
                        Map.of("line", "Line D Inspection", "kwh", 2700, "share", 8.0)
                ))
                .build();

        // Maintenance Overview
        MaintenanceOverviewDto maintenanceOverview = MaintenanceOverviewDto.builder()
                .mtbfHours(148.5)
                .mttrHours(2.4)
                .pendingWorkOrdersCount(6)
                .criticalWorkOrdersCount(2)
                .predictiveMaintenanceAccuracy(96.8)
                .workOrders(List.of(
                        MaintenanceOverviewDto.WorkOrderDto.builder()
                                .id(UUID.fromString("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"))
                                .workOrderNumber("WO-9082")
                                .machineName("Schuler Stamping Press 500T")
                                .issueDescription("Hydraulic fluid temperature spike & high vibration anomaly")
                                .priority("CRITICAL")
                                .status("SCHEDULED")
                                .failureProbability(78.2)
                                .assignedTechnician("Alex Mercer")
                                .estimatedDurationHours(3)
                                .scheduledDate("2026-07-31 14:00")
                                .build(),
                        MaintenanceOverviewDto.WorkOrderDto.builder()
                                .id(UUID.fromString("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"))
                                .workOrderNumber("WO-9078")
                                .machineName("KUKA Robotic Weld-Arm 4")
                                .issueDescription("Joint #3 motor housing thermal decay prediction")
                                .priority("HIGH")
                                .status("IN_PROGRESS")
                                .failureProbability(38.5)
                                .assignedTechnician("Sarah Jenkins")
                                .estimatedDurationHours(2)
                                .scheduledDate("2026-07-31 11:30")
                                .build(),
                        MaintenanceOverviewDto.WorkOrderDto.builder()
                                .id(UUID.fromString("cccccccc-cccc-cccc-cccc-cccccccccccc"))
                                .workOrderNumber("WO-9065")
                                .machineName("Bosch Rexroth Pump H2")
                                .issueDescription("Routine seal calibration and filter mesh check")
                                .priority("MEDIUM")
                                .status("SCHEDULED")
                                .failureProbability(18.0)
                                .assignedTechnician("Kenji Sato")
                                .estimatedDurationHours(1)
                                .scheduledDate("2026-08-01 09:00")
                                .build()
                ))
                .build();

        // AI Recommendations Panel
        List<AIRecommendationDto> aiRecommendations = List.of(
                AIRecommendationDto.builder()
                        .id("REC-01")
                        .title("Predictive Maintenance Override - Stamping Press 500T")
                        .category("PREDICTIVE_MAINTENANCE")
                        .impact("High")
                        .description("Press 500T hydraulic pressure fluctuation detected at 2,100 PSI with 94.8°C thermal rise. Performing immediate valve seal replacement avoids catastrophic main pump failure.")
                        .actionableStep("Dispatch technician Alex Mercer & pause Line A for 45 mins.")
                        .confidenceScore(96.4)
                        .estimatedSavings("Avoids $85,000 unplanned downtime cost")
                        .build(),
                AIRecommendationDto.builder()
                        .id("REC-02")
                        .title("Dynamic Energy Load Shifting - Peak Demand Reduction")
                        .category("ENERGY_SAVING")
                        .impact("Medium")
                        .description("Grid demand load is projected to hit peak tariffs between 14:00 - 16:00. Throttling Line B welding power buffer by 12% during peak window cuts demand charges.")
                        .actionableStep("Enable AI Smart Grid Throttle mode.")
                        .confidenceScore(92.8)
                        .estimatedSavings("$3,400 per shift in peak demand surcharges")
                        .build(),
                AIRecommendationDto.builder()
                        .id("REC-03")
                        .title("Robotic Arm Weld-Speed Calibration")
                        .category("QUALITY_OPTIMIZATION")
                        .impact("Medium")
                        .description("Micro-fissures in Line B welds reduced by 40% when robotic feed speed is lowered from 450 mm/s to 420 mm/s.")
                        .actionableStep("Apply automated robot trajectory profile updates.")
                        .confidenceScore(94.1)
                        .estimatedSavings("Increase overall yield from 98.2% to 99.4%")
                        .build()
        );

        // Manufacturing Alerts Panel
        List<ManufacturingAlertDto> alerts = List.of(
                ManufacturingAlertDto.builder()
                        .id(UUID.fromString("10000000-0000-0000-0000-000000000001"))
                        .title("Machine Failure Anomaly")
                        .category("Machine Failure")
                        .severity("CRITICAL")
                        .message("Robotic Weld-Arm joint lock failure detected on Joint 3 (spindle speed locked at 0).")
                        .machineCode("WELD-204")
                        .status("ACTIVE")
                        .timestamp("5m ago")
                        .build(),
                ManufacturingAlertDto.builder()
                        .id(UUID.fromString("15000000-0000-0000-0000-000000000001"))
                        .title("Safety Curtain Breach")
                        .category("Safety Warning")
                        .severity("CRITICAL")
                        .message("Light curtain safety barrier violation detected at press loading station Sector 1A.")
                        .machineCode("PRESS-301")
                        .status("ACTIVE")
                        .timestamp("12m ago")
                        .build(),
                ManufacturingAlertDto.builder()
                        .id(UUID.fromString("20000000-0000-0000-0000-000000000002"))
                        .title("High Temperature Alarm")
                        .category("High Temperature")
                        .severity("HIGH")
                        .message("Schuler Stamping Press 500T temperature exceeded safety threshold: 94.8°C (limit: 90.0°C).")
                        .machineCode("PRESS-301")
                        .status("ACTIVE")
                        .timestamp("18m ago")
                        .build(),
                ManufacturingAlertDto.builder()
                        .id(UUID.fromString("25000000-0000-0000-0000-000000000002"))
                        .title("Assembly Feed Delay")
                        .category("Production Delay")
                        .severity("HIGH")
                        .message("Assembly Line B production feed speed fell 18% below planned shifts target.")
                        .machineCode("LINE-B")
                        .status("ACKNOWLEDGED")
                        .timestamp("45m ago")
                        .build(),
                ManufacturingAlertDto.builder()
                        .id(UUID.fromString("30000000-0000-0000-0000-000000000003"))
                        .title("Peak Load Tariff Warning")
                        .category("High Energy Usage")
                        .severity("MEDIUM")
                        .message("Industrial grid peak tariff window initiated. Demand currently at 4.8 MW.")
                        .machineCode("GRID- Detroit")
                        .status("ACTIVE")
                        .timestamp("1h ago")
                        .build(),
                ManufacturingAlertDto.builder()
                        .id(UUID.fromString("35000000-0000-0000-0000-000000000003"))
                        .title("Calibrations Cycle Due")
                        .category("Maintenance Due")
                        .severity("LOW")
                        .message("Hydraulic pump valve filter and gasket seal scheduled replacements are due.")
                        .machineCode("PUMP-402")
                        .status("ACTIVE")
                        .timestamp("3h ago")
                        .build()
        );

        // Recent Activities Log
        List<ActivityLogDto> recentActivities = List.of(
                ActivityLogDto.builder()
                        .id("ACT-101")
                        .title("Machine Telemetry Calibrated")
                        .description("CNC Lathe Ultra 5X spindle speed sensor recalibrated successfully.")
                        .type("MACHINE")
                        .timestamp("15m ago")
                        .operator("John Doe (Tech)")
                        .build(),
                ActivityLogDto.builder()
                        .id("ACT-102")
                        .title("Shift 1 Progress Sync")
                        .description("Morning shift logged 4,320 completed automotive units (91.5% OEE).")
                        .type("SHIFT")
                        .timestamp("40m ago")
                        .operator("Marcus Vance (Lead)")
                        .build(),
                ActivityLogDto.builder()
                        .id("ACT-103")
                        .title("Predictive Work Order Created")
                        .description("Work Order WO-9082 automatically issued by AI Decision Engine.")
                        .type("MAINTENANCE")
                        .timestamp("1h ago")
                        .operator("AI Decision Engine")
                        .build()
        );

        return ManufacturingDashboardDto.builder()
                .factoryOverview(factoryOverview)
                .machines(machines)
                .productionOverview(productionOverview)
                .shiftPerformance(shiftPerformance)
                .energyConsumption(energyConsumption)
                .maintenanceOverview(maintenanceOverview)
                .aiRecommendations(aiRecommendations)
                .alerts(alerts)
                .recentActivities(recentActivities)
                .build();
    }

    public List<MachineStatusDto> getMachines() {
        return getDashboardData().getMachines();
    }

    public Map<String, Object> simulate(Map<String, Object> params) {
        int machineAge = Integer.parseInt(String.valueOf(params.getOrDefault("machineAgeMonths", "24")));
        double operatingTemp = Double.parseDouble(String.valueOf(params.getOrDefault("operatingTemp", "78.5")));
        double vibration = Double.parseDouble(String.valueOf(params.getOrDefault("vibration", "3.2")));
        int spindleSpeed = Integer.parseInt(String.valueOf(params.getOrDefault("spindleSpeed", "2800")));

        String context = String.format("Machine Age: %d months, Operating Temp: %.1f °C, Vibration: %.1f mm/s, Spindle Speed: %d RPM",
                machineAge, operatingTemp, vibration, spindleSpeed);

        Map<String, Object> riskRes = aiService.predictRisks(context);
        List<String> recommendations = aiService.getRecommendations("Manufacturing machine parameters: " + context);
        String summary = aiService.generateExecutiveSummary(Map.of(
                "machineAgeMonths", machineAge,
                "operatingTemp", operatingTemp,
                "vibration", vibration,
                "spindleSpeed", spindleSpeed
        ));

        Map<String, Object> result = new HashMap<>();
        result.put("industry", "Manufacturing");
        result.put("context", context);
        result.put("riskAnalysis", riskRes);
        result.put("recommendations", recommendations);
        result.put("executiveSummary", summary);
        result.put("predictedOeeImpact", operatingTemp > 85 ? "-12.4%" : "-2.1%");
        result.put("failureProbability", operatingTemp > 90 || vibration > 5.0 ? "HIGH (74.8%)" : "LOW (12.3%)");

        return result;
    }

    public Map<String, String> acknowledgeAlert(UUID alertId) {
        return Map.of("id", alertId.toString(), "status", "ACKNOWLEDGED", "message", "Alert acknowledged successfully");
    }

    public Map<String, String> resolveAlert(UUID alertId) {
        return Map.of("id", alertId.toString(), "status", "RESOLVED", "message", "Alert resolved successfully");
    }

    public Map<String, Object> createWorkOrder(Map<String, Object> params) {
        String machineName = String.valueOf(params.getOrDefault("machineName", "CNC-101"));
        String issue = String.valueOf(params.getOrDefault("issueDescription", "Preventive Maintenance"));
        String priority = String.valueOf(params.getOrDefault("priority", "HIGH"));

        String woId = "WO-" + (1000 + new Random().nextInt(9000));
        Map<String, Object> wo = new HashMap<>();
        wo.put("id", UUID.randomUUID().toString());
        wo.put("workOrderNumber", woId);
        wo.put("machineName", machineName);
        wo.put("issueDescription", issue);
        wo.put("priority", priority);
        wo.put("status", "SCHEDULED");
        wo.put("assignedTechnician", "AI Assigned Tech");
        wo.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return wo;
    }

    public Map<String, Object> optimizeEnergy() {
        String prompt = "You are an industrial energy efficiency AI controller. Generate 3 specific actions to lower plant peak demand by 15% without impacting production throughput.";
        String aiResponse = aiService.chat("Energy Optimization Controller", prompt);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "SUCCESS");
        result.put("estimatedSavingsKwh", 4800.0);
        result.put("costSavingsUsd", 576.0);
        result.put("aiStrategy", aiResponse);

        return result;
    }
}
