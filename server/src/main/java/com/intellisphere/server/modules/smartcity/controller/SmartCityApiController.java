package com.intellisphere.server.modules.smartcity.controller;

import com.intellisphere.server.modules.smartcity.dto.SmartCityDashboardDto;
import com.intellisphere.server.modules.smartcity.service.SmartCityService;
import com.intellisphere.server.modules.reports.ReportGeneratorService;
import com.intellisphere.server.modules.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping
public class SmartCityApiController {

    private final SmartCityService smartCityService;
    private final ReportGeneratorService reportGeneratorService;
    private final AIService aiService;

    @Autowired
    public SmartCityApiController(SmartCityService smartCityService,
                                   ReportGeneratorService reportGeneratorService,
                                   AIService aiService) {
        this.smartCityService = smartCityService;
        this.reportGeneratorService = reportGeneratorService;
        this.aiService = aiService;
    }

    @GetMapping("/api/smartcity/dashboard")
    public ResponseEntity<SmartCityDashboardDto> getDashboard() {
        return ResponseEntity.ok(smartCityService.getDashboardData());
    }

    @GetMapping("/api/smartcity/traffic")
    public ResponseEntity<List<Map<String, Object>>> getTraffic() {
        return ResponseEntity.ok(smartCityService.getTraffic());
    }

    @GetMapping("/api/smartcity/pollution")
    public ResponseEntity<SmartCityDashboardDto.PollutionMetrics> getPollution() {
        return ResponseEntity.ok(smartCityService.getDashboardData().getPollutionMetrics());
    }

    @GetMapping("/api/smartcity/waste")
    public ResponseEntity<List<Map<String, Object>>> getWaste() {
        return ResponseEntity.ok(smartCityService.getDashboardData().getWasteContainers());
    }

    @GetMapping("/api/smartcity/alerts")
    public ResponseEntity<List<Map<String, Object>>> getAlerts() {
        return ResponseEntity.ok(smartCityService.getDashboardData().getAlerts());
    }

    @PostMapping("/api/smartcity/complaints")
    public ResponseEntity<Map<String, Object>> createComplaint(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(smartCityService.createComplaint(params));
    }

    @PostMapping("/api/smartcity/alerts/{id}/acknowledge")
    public ResponseEntity<Map<String, String>> acknowledgeAlert(@PathVariable UUID id) {
        return ResponseEntity.ok(smartCityService.acknowledgeAlert(id));
    }

    @PostMapping("/api/smartcity/alerts/{id}/resolve")
    public ResponseEntity<Map<String, String>> resolveAlert(@PathVariable UUID id) {
        return ResponseEntity.ok(smartCityService.resolveAlert(id));
    }

    @PostMapping("/api/smartcity/report")
    public ResponseEntity<byte[]> generateReport(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        Map<String, Object> metrics = (Map<String, Object>) body.getOrDefault("metrics", Map.of(
                "aqiIndex", "64",
                "gridLoad", "186.2 MW",
                "activeAlerts", "2 critical alerts",
                "cityStatus", "NORMAL"
        ));
        @SuppressWarnings("unchecked")
        List<String> alerts = (List<String>) body.getOrDefault("alerts", List.of(
                "Grid Load shedding Alert Metropolitan Grid B",
                "Major Multi-Car Accident Grand Ave"
        ));
        String predictions = String.valueOf(body.getOrDefault("predictions", "Traffic congestion detour optimization saves trip latency by 14 mins."));
        String userNotes = String.valueOf(body.getOrDefault("userNotes", "Municipal operations briefing compiled. Central grid stable."));

        byte[] pdfBytes = reportGeneratorService.generatePdfReport(metrics, alerts, predictions, userNotes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "IntelliSphere_SmartCity_Brief.pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // --- SMART CITY AI ENGINE REST APIs ---

    /**
     * 1. AI City Assistant Chat
     */
    @PostMapping("/api/ai/smartcity/chat")
    public ResponseEntity<Map<String, String>> chatAssistant(@RequestBody Map<String, String> request) {
        String prompt = request.getOrDefault("prompt", "What is the overall municipal status?");
        String reply = aiService.chat("Smart City Operations Assistant", prompt);
        return ResponseEntity.ok(Map.of("response", reply));
    }

    /**
     * 2. Traffic Prediction
     */
    @PostMapping("/api/ai/smartcity/traffic-prediction")
    public ResponseEntity<Map<String, Object>> predictTraffic(@RequestBody Map<String, Object> params) {
        String zone = String.valueOf(params.getOrDefault("zone", "Interstate-90 Expressway"));
        @SuppressWarnings("unchecked")
        List<Double> histSpeed = (List<Double>) params.getOrDefault("historicalSpeedData", List.of(45.0, 42.0, 38.0, 22.0, 18.5));
        
        Map<String, Object> forecast = aiService.forecastTrends(histSpeed);
        
        Map<String, Object> response = new HashMap<>();
        response.put("zone", zone);
        response.put("forecastAnalysis", forecast.get("projectedData"));
        response.put("trendDirection", forecast.get("trendDirection"));
        response.put("estimatedCongestionMultiplier", 1.45);
        return ResponseEntity.ok(response);
    }

    /**
     * 3. Pollution Forecast
     */
    @PostMapping("/api/ai/smartcity/pollution-forecast")
    public ResponseEntity<Map<String, Object>> forecastPollution(@RequestBody Map<String, Object> params) {
        @SuppressWarnings("unchecked")
        List<Double> histAqi = (List<Double>) params.getOrDefault("historicalAqiData", List.of(54.0, 58.0, 62.0, 78.0, 64.0));
        
        Map<String, Object> forecast = aiService.forecastTrends(histAqi);
        
        Map<String, Object> response = new HashMap<>();
        response.put("forecastAnalysis", forecast.get("projectedData"));
        response.put("trendDirection", forecast.get("trendDirection"));
        response.put("projectedAqiIndex", 72);
        return ResponseEntity.ok(response);
    }

    /**
     * 4. Emergency Risk Prediction
     */
    @PostMapping("/api/ai/smartcity/emergency-risk")
    public ResponseEntity<Map<String, Object>> predictEmergencyRisk(@RequestBody Map<String, Object> params) {
        String targetAsset = String.valueOf(params.getOrDefault("asset", "Metropolitan Grid B"));
        double currentLoad = Double.parseDouble(String.valueOf(params.getOrDefault("currentLoad", "186.2")));
        
        String context = String.format("Asset: %s, Current Operating Load: %.1f MW against capacity 200.0 MW", targetAsset, currentLoad);
        Map<String, Object> risks = aiService.predictRisks(context);
        
        Map<String, Object> response = new HashMap<>();
        response.put("targetAsset", targetAsset);
        response.put("riskAnalysis", risks.get("riskAnalysis"));
        response.put("riskLevel", risks.get("riskLevel"));
        response.put("failureProbability", currentLoad > 180 ? 0.78 : 0.12);
        response.put("confidenceScore", risks.get("confidenceIndex"));
        return ResponseEntity.ok(response);
    }

    /**
     * 5. Resource Optimization
     */
    @PostMapping({"/api/ai/smartcity/optimize-resources", "/api/ai/smartcity/optimize-traffic", "/api/ai/smartcity/optimize-grid"})
    public ResponseEntity<Map<String, Object>> optimizeResources(@RequestBody Map<String, Object> params) {
        if (params.containsKey("zone")) {
            return ResponseEntity.ok(smartCityService.optimizeTraffic(params));
        } else {
            return ResponseEntity.ok(smartCityService.optimizeGrid(params));
        }
    }

    /**
     * 6. AI Executive Summary
     */
    @PostMapping({"/api/ai/smartcity/executive-summary", "/api/ai/smartcity-summary"})
    public ResponseEntity<Map<String, Object>> getCitySummary(@RequestBody Map<String, Object> metrics) {
        int aqi = Integer.parseInt(String.valueOf(metrics.getOrDefault("aqiIndex", "64")));
        double gridLoad = Double.parseDouble(String.valueOf(metrics.getOrDefault("gridLoadMw", "142.5")));

        String prompt = String.format("Synthesize city operations performance: Air Quality AQI score of %d (Moderate), and public grid load of %.1f MW. " +
                "Evaluate city sustainability indexes and write an executive briefing.", aqi, gridLoad);
        
        String summary = aiService.chat("City Intelligence Analyzer Mode", prompt);
        return ResponseEntity.ok(Map.of("summary", summary, "sustainabilityIndex", aqi < 100 ? "OPTIMAL" : "SUB-OPTIMAL"));
    }

    /**
     * 7. Citizen Complaint Analysis
     */
    @PostMapping("/api/ai/smartcity/complaint-analysis")
    public ResponseEntity<Map<String, Object>> analyzeComplaint(@RequestBody Map<String, Object> complaint) {
        String title = String.valueOf(complaint.getOrDefault("title", "Water Main Anomaly"));
        String desc = String.valueOf(complaint.getOrDefault("description", "Vast water leak on Madison road pavement."));

        String prompt = String.format("Classify and analyze citizen complaint: Title: %s. Description: %s. " +
                "Determine severity tier (CRITICAL, HIGH, MEDIUM, LOW), routing department, and response priority.", title, desc);
        
        String analysis = aiService.chat("Complaint Classification AI System", prompt);
        
        Map<String, Object> response = new HashMap<>();
        response.put("analysisText", analysis);
        response.put("detectedSeverity", desc.toLowerCase().contains("leak") ? "HIGH" : "MEDIUM");
        response.put("routingDepartment", desc.toLowerCase().contains("water") ? "MUNICIPAL_WATER_WORKS" : "POWER_GRID_MAINTENANCE");
        return ResponseEntity.ok(response);
    }

    /**
     * 8. Root Cause Analysis
     */
    @PostMapping("/api/ai/smartcity/root-cause")
    public ResponseEntity<Map<String, Object>> diagnoseRootCause(@RequestBody Map<String, Object> incident) {
        String alertTitle = String.valueOf(incident.getOrDefault("alert", "Outage Warning"));
        String details = String.valueOf(incident.getOrDefault("details", "Grid B demand exceeded sub-station thresholds."));

        String prompt = String.format("You are a municipal diagnostic engineer. Formulate root cause hypotheses for the following alert: %s (%s). " +
                "Outline trigger events, validation checklists, and preventive plans.", alertTitle, details);
        
        String diagnosis = aiService.chat("Root Cause Diagnostic System", prompt);
        return ResponseEntity.ok(Map.of("incident", alertTitle, "rootCauseAnalysis", diagnosis));
    }

    /**
     * 9. AI Recommendations
     */
    @PostMapping("/api/ai/smartcity/recommendations")
    public ResponseEntity<Map<String, Object>> getAiRecommendations(@RequestBody Map<String, String> request) {
        String sector = request.getOrDefault("sector", "ENERGY");
        List<String> recsList = aiService.getRecommendations("Sub-station energy storage sizing for municipal sector " + sector);
        
        Map<String, Object> response = new HashMap<>();
        response.put("sector", sector);
        response.put("recommendations", recsList);
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}
