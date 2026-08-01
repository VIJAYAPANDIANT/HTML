package com.intellisphere.server.modules.smartcity.dto;

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
public class SmartCityDashboardDto {

    private CityDetails cityDetails;
    private List<Map<String, Object>> trafficZones;
    private PollutionMetrics pollutionMetrics;
    private List<Map<String, Object>> wasteContainers;
    private List<Map<String, Object>> waterStations;
    private List<Map<String, Object>> powerGrids;
    private List<Map<String, Object>> infrastructureAssets;
    private List<Map<String, Object>> citizenComplaints;
    private List<Map<String, Object>> alerts;
    private List<Map<String, Object>> recommendations;
    private List<Map<String, Object>> recentActivities;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CityDetails {
        private String name;
        private String location;
        private String status;
        private int population;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PollutionMetrics {
        private int aqiIndex;
        private double pm25;
        private double pm10;
        private double co2;
        private String status;
    }
}
