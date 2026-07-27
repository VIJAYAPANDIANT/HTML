package com.intellisphere.server.modules.healthcare.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class HealthcareDashboardDto {
    private int totalPatients;
    private int availableBeds;
    private int emergencyCases;
    private int activeStaff;
    private List<PatientDto> patients;
    private List<AlertDto> alerts;
    private List<String> aiRecommendations;
    private List<Map<String, Object>> bedGrid;
    private Map<String, Object> departmentAnalytics;
}
