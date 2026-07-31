package com.intellisphere.server.modules.manufacturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MachineStatusDto {
    private UUID id;
    private String name;
    private String machineCode;
    private String type;
    private String productionLine;
    private String status; // OPERATIONAL, WARNING, CRITICAL, MAINTENANCE, IDLE
    private int healthScore; // 0 - 100
    private double temperature; // °C
    private double vibration; // mm/s
    private double spindleSpeed; // RPM
    private double hydraulicPressure; // PSI
    private int ageMonths;
    private String lastMaintenance;
    private String nextMaintenance;
    private String failureRisk; // Low, Medium, High, Severe
}
