package com.intellisphere.server.modules.manufacturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceOverviewDto {
    private double mtbfHours; // Mean Time Between Failures
    private double mttrHours; // Mean Time To Repair
    private int pendingWorkOrdersCount;
    private int criticalWorkOrdersCount;
    private double predictiveMaintenanceAccuracy; // e.g. 96.8%
    private List<WorkOrderDto> workOrders;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkOrderDto {
        private UUID id;
        private String workOrderNumber;
        private String machineName;
        private String issueDescription;
        private String priority;
        private String status;
        private double failureProbability;
        private String assignedTechnician;
        private int estimatedDurationHours;
        private String scheduledDate;
    }
}
