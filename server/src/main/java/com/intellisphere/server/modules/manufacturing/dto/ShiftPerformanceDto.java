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
public class ShiftPerformanceDto {
    private String currentShift; // Morning Shift (06:00 - 14:00)
    private String activeSupervisor;
    private double currentShiftProgress; // %
    private List<ShiftSummaryDto> shifts;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ShiftSummaryDto {
        private String name; // Shift 1 (Morning)
        private String supervisor;
        private int targetUnits;
        private int actualUnits;
        private int downtimeMinutes;
        private double oeePercentage;
        private String status; // COMPLETED, ACTIVE, UPCOMING
    }
}
