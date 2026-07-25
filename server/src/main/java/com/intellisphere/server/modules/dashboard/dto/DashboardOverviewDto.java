package com.intellisphere.server.modules.dashboard.dto;

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
public class DashboardOverviewDto {
    private long organizations;
    private long alerts;
    private long predictions;
    private long reports;
    private List<Map<String, Object>> recentActivities;
    private List<String> aiInsights;
}
