package com.intellisphere.server.modules.smartcity.service;

import com.intellisphere.server.modules.ai.AIService;
import com.intellisphere.server.modules.smartcity.dto.SmartCityDashboardDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class SmartCityService {

    private final AIService aiService;

    @Autowired
    public SmartCityService(AIService aiService) {
        this.aiService = aiService;
    }

    public SmartCityDashboardDto getDashboardData() {
        // City Overview
        SmartCityDashboardDto.CityDetails cityDetails = SmartCityDashboardDto.CityDetails.builder()
                .name("IntelliSphere Metropolis - Sector 7")
                .location("Chicago, IL - USA")
                .status("NORMAL")
                .population(840000)
                .build();

        // Air Quality
        SmartCityDashboardDto.PollutionMetrics pollutionMetrics = SmartCityDashboardDto.PollutionMetrics.builder()
                .aqiIndex(64)
                .pm25(14.8)
                .pm10(28.4)
                .co2(412.0)
                .status("MODERATE")
                .build();

        // Traffic Zones
        List<Map<String, Object>> trafficZones = List.of(
                Map.of("id", "ZONE-A", "name", "Downtown Loop", "status", "FLOWING", "averageSpeedKmh", 48.0, "congestion", 12),
                Map.of("id", "ZONE-B", "name", "Interstate-90 Expressway", "status", "CONGESTED", "averageSpeedKmh", 18.5, "congestion", 78),
                Map.of("id", "ZONE-C", "name", "Industrial Bypass", "status", "FLOWING", "averageSpeedKmh", 55.0, "congestion", 8),
                Map.of("id", "ZONE-D", "name", "Residential Boulevard", "status", "BLOCKED", "averageSpeedKmh", 0.0, "congestion", 100)
        );

        // Waste Containers
        List<Map<String, Object>> wasteContainers = List.of(
                Map.of("id", "BIN-101", "location", "City Hall Square", "fillPercentage", 42, "status", "NORMAL"),
                Map.of("id", "BIN-204", "location", "Expressway Transit Terminal", "fillPercentage", 94, "status", "FULL"),
                Map.of("id", "BIN-301", "location", "Sector 7 Park Wing", "fillPercentage", 78, "status", "WARNING"),
                Map.of("id", "BIN-402", "location", "Retail Galleria Blvd", "fillPercentage", 18, "status", "NORMAL")
        );

        // Water Stations
        List<Map<String, Object>> waterStations = List.of(
                Map.of("id", "WATER-01", "name", "Main Filtration Plant A", "flowRateLps", 1450.0, "pressureBar", 4.2, "purity", 99.4, "status", "NORMAL"),
                Map.of("id", "WATER-02", "name", "Metro Pressure Reservoir 4", "flowRateLps", 820.0, "pressureBar", 2.1, "purity", 98.8, "status", "WARNING"),
                Map.of("id", "WATER-03", "name", "Bypass Pump Terminal 12", "flowRateLps", 1100.0, "pressureBar", 4.8, "purity", 99.1, "status", "NORMAL")
        );

        // Power Grids
        List<Map<String, Object>> powerGrids = List.of(
                Map.of("id", "GRID-A", "name", "Metropolitan Grid A", "loadMw", 142.5, "capacityMw", 200.0, "status", "STABLE"),
                Map.of("id", "GRID-B", "name", "Robotic Manufacturing Grid B", "loadMw", 186.2, "capacityMw", 200.0, "status", "WARNING"),
                Map.of("id", "GRID-C", "name", "Residential Grid C", "loadMw", 98.0, "capacityMw", 150.0, "status", "STABLE")
        );

        // Infrastructure Assets
        List<Map<String, Object>> infrastructureAssets = List.of(
                Map.of("id", "INFRA-01", "name", "Madison River Crossing Bridge", "type", "BRIDGE", "healthScore", 96, "status", "OPERATIONAL"),
                Map.of("id", "INFRA-02", "name", "Grand Avenue Subway Line A", "type", "SUBWAY", "healthScore", 72, "status", "MAINTENANCE"),
                Map.of("id", "INFRA-03", "name", "Central Municipal Park Grounds", "type", "PARK", "healthScore", 98, "status", "OPERATIONAL")
        );

        // Citizen Complaints
        List<Map<String, Object>> citizenComplaints = List.of(
                Map.of("id", "COMP-981", "title", "Water Valve Leakage", "category", "WATER", "description", "Water pooling outside Sector 7 high school gate.", "status", "IN_PROGRESS", "reporter", "John Smith"),
                Map.of("id", "COMP-978", "title", "Overflowing Bin Area A", "category", "WASTE", "description", "City Hall Square bins filled past capacity, spillages.", "status", "OPEN", "reporter", "Elena Rostova"),
                Map.of("id", "COMP-965", "title", "Traffic Light Timing Issue", "category", "TRAFFIC", "description", "Light cycles at I-90 offramp causing gridlock.", "status", "RESOLVED", "reporter", "Marcus Vance")
        );

        // Alerts Panel (Including all 6 requested types across critical/high/medium/low)
        List<Map<String, Object>> alerts = List.of(
                Map.of("id", "10000000-0000-0000-0000-000000000001", "title", "Grid Load shedding Alert", "category", "POWER_GRID", "severity", "CRITICAL", "message", "Metropolitan Grid B peak demand exceeded 186 MW. Automatic load shedding initiated.", "status", "ACTIVE", "timestamp", "5m ago"),
                Map.of("id", "15000000-0000-0000-0000-000000000001", "title", "Major Multi-Car Accident", "category", "TRAFFIC", "severity", "CRITICAL", "message", "Collision on Grand Ave blocking Residential Boulevard loop completely. Emergency units dispatched.", "status", "ACTIVE", "timestamp", "12m ago"),
                Map.of("id", "20000000-0000-0000-0000-000000000002", "title", "Water Main Anomaly", "category", "WATER_MAIN", "severity", "HIGH", "message", "Metro Pressure Reservoir 4 drop in pressure below 2.1 bar, suspect pipeline main break.", "status", "ACTIVE", "timestamp", "20m ago"),
                Map.of("id", "25000000-0000-0000-0000-000000000002", "title", "Critical AQI Breach", "category", "POLLUTION", "severity", "HIGH", "message", "Industrial bypass zone PM2.5 levels rose to 45 ug/m3. Citizen safety alerts pushed.", "status", "ACTIVE", "timestamp", "45m ago"),
                Map.of("id", "30000000-0000-0000-0000-000000000003", "title", "Waste Overflow Warning", "category", "WASTE", "severity", "MEDIUM", "message", "Expressway Transit Terminal Bin filled to 94% capacity. Schedule dump route.", "status", "ACKNOWLEDGED", "timestamp", "1h ago"),
                Map.of("id", "35000000-0000-0000-0000-000000000003", "title", "Infrastructure Inspection", "category", "INFRASTRUCTURE", "severity", "LOW", "message", "Madison River Crossing Bridge bi-annual structural safety audit is scheduled.", "status", "ACTIVE", "timestamp", "3h ago")
        );

        // AI Recommendations
        List<Map<String, Object>> recommendations = List.of(
                Map.of("id", "REC-01", "title", "Dynamic Traffic Rerouting - I-90 Bypass", "category", "TRAFFIC", "impact", "High", "description", "Rerouting I-90 Expressway commute traffic to Madison Crossing cuts Downtown gridlock by 22%.", "estimatedSavings", "Reduces aggregate trip latency by 14 mins"),
                Map.of("id", "REC-02", "title", "Smart Grid Load Balance Throttles", "category", "ENERGY", "impact", "High", "description", "Grid B industrial tariffs projections indicate peak grid stress at 14:00. Shedding auxiliary backup loads avoids localized outages.", "estimatedSavings", "Protects $120,000 sub-station transformers"),
                Map.of("id", "REC-03", "title", "Waste Container Smart Dispatch", "category", "WASTE", "impact", "Medium", "description", "Re-optimizing waste truck trajectories to address 90%+ filled bin codes first reduces fuel emissions.", "estimatedSavings", "Cuts route mileage by 18% weekly")
        );

        // Recent Activities Log
        List<Map<String, Object>> recentActivities = List.of(
                Map.of("id", "ACT-01", "title", "Grid Load shed Triggered", "description", "Substation 7 shifted 12MW to metropolitan bypass.", "type", "ENERGY", "timestamp", "10m ago", "operator", "Grid Central AI"),
                Map.of("id", "ACT-02", "title", "Complaint Filed COMP-981", "description", "Water leak logged for central boulevard wing.", "type", "WATER", "timestamp", "25m ago", "operator", "Citizen Portal"),
                Map.of("id", "ACT-03", "title", "Emergency Dispatch", "description", "Route A closed. Emergency detours deployed.", "type", "TRAFFIC", "timestamp", "40m ago", "operator", "EMS Dispatch")
        );

        return SmartCityDashboardDto.builder()
                .cityDetails(cityDetails)
                .pollutionMetrics(pollutionMetrics)
                .trafficZones(trafficZones)
                .wasteContainers(wasteContainers)
                .waterStations(waterStations)
                .powerGrids(powerGrids)
                .infrastructureAssets(infrastructureAssets)
                .citizenComplaints(citizenComplaints)
                .alerts(alerts)
                .recommendations(recommendations)
                .recentActivities(recentActivities)
                .build();
    }

    public List<Map<String, Object>> getTraffic() {
        return getDashboardData().getTrafficZones();
    }

    public Map<String, String> acknowledgeAlert(UUID id) {
        return Map.of("id", id.toString(), "status", "ACKNOWLEDGED", "message", "Alert acknowledged successfully");
    }

    public Map<String, String> resolveAlert(UUID id) {
        return Map.of("id", id.toString(), "status", "RESOLVED", "message", "Alert resolved successfully");
    }

    public Map<String, Object> createComplaint(Map<String, Object> params) {
        String title = String.valueOf(params.getOrDefault("title", "Street Light Anomaly"));
        String category = String.valueOf(params.getOrDefault("category", "ENERGY"));
        String desc = String.valueOf(params.getOrDefault("description", "Light flashing persistently."));
        String reporter = String.valueOf(params.getOrDefault("reporterName", "Anonymous"));

        String compNumber = "COMP-" + (1000 + new Random().nextInt(9000));
        Map<String, Object> cc = new HashMap<>();
        cc.put("id", UUID.randomUUID().toString());
        cc.put("complaintNumber", compNumber);
        cc.put("title", title);
        cc.put("category", category);
        cc.put("description", desc);
        cc.put("status", "OPEN");
        cc.put("reporterName", reporter);
        cc.put("createdAt", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return cc;
    }

    public Map<String, Object> optimizeTraffic(Map<String, Object> params) {
        String zone = String.valueOf(params.getOrDefault("zone", "Downtown Loop"));
        int congestion = Integer.parseInt(String.valueOf(params.getOrDefault("congestionPercentage", "78")));

        String prompt = String.format("You are a municipal traffic engineer. Traffic zone %s is at %d %% congestion. " +
                "Evaluate bottlenecks, map detour detours, and write dynamic signal timing updates.", zone, congestion);
        
        String strategy = aiService.chat("Traffic Optimization Controller", prompt);

        Map<String, Object> result = new HashMap<>();
        result.put("zone", zone);
        result.put("congestionLevel", congestion);
        result.put("aiDetours", strategy);
        result.put("estimatedLatencyReduction", "14 mins average trip drop");
        return result;
    }

    public Map<String, Object> optimizeGrid(Map<String, Object> params) {
        double load = Double.parseDouble(String.valueOf(params.getOrDefault("loadMw", "186.2")));
        double capacity = Double.parseDouble(String.valueOf(params.getOrDefault("capacityMw", "200.0")));

        String prompt = String.format("You are an industrial power grid AI dispatcher. Current load is %.1f MW against capacity %.1f MW. " +
                "Generate 3 immediate load-shedding options or auxiliary transfer strategies.", load, capacity);
        
        String strategy = aiService.chat("Power Grid Optimization Mode", prompt);

        Map<String, Object> result = new HashMap<>();
        result.put("loadMw", load);
        result.put("capacityMw", capacity);
        result.put("aiStrategy", strategy);
        result.put("savingsKw", 14500.0);
        return result;
    }
}
