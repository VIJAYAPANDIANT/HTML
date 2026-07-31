package com.intellisphere.server.modules.manufacturing.controller;

import com.intellisphere.server.modules.manufacturing.dto.*;
import com.intellisphere.server.modules.manufacturing.service.ManufacturingService;
import com.intellisphere.server.modules.reports.ReportGeneratorService;
import com.intellisphere.server.modules.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping
public class ManufacturingApiController {

    private final ManufacturingService manufacturingService;
    private final ReportGeneratorService reportGeneratorService;
    private final AIService aiService;

    @Autowired
    public ManufacturingApiController(ManufacturingService manufacturingService,
                                        ReportGeneratorService reportGeneratorService,
                                        AIService aiService) {
        this.manufacturingService = manufacturingService;
        this.reportGeneratorService = reportGeneratorService;
        this.aiService = aiService;
    }

    @GetMapping({"/api/v1/manufacturing/dashboard", "/api/manufacturing/dashboard"})
    public ResponseEntity<ManufacturingDashboardDto> getDashboard() {
        return ResponseEntity.ok(manufacturingService.getDashboardData());
    }

    @GetMapping({"/api/v1/manufacturing/machines", "/api/manufacturing/machines"})
    public ResponseEntity<List<MachineStatusDto>> getMachines() {
        return ResponseEntity.ok(manufacturingService.getMachines());
    }

    @GetMapping({"/api/v1/manufacturing/analytics", "/api/manufacturing/analytics"})
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(Map.of(
            "productionYield", 98.2,
            "overallOee", 88.4,
            "downtimeMinutes", 145,
            "energySavingsUsd", 3400
        ));
    }

    @GetMapping({"/api/v1/manufacturing/alerts", "/api/manufacturing/alerts"})
    public ResponseEntity<List<ManufacturingAlertDto>> getAlerts() {
        return ResponseEntity.ok(manufacturingService.getDashboardData().getAlerts());
    }

    @PostMapping({"/api/v1/manufacturing/simulate", "/api/manufacturing/simulate"})
    public ResponseEntity<Map<String, Object>> runSimulation(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(manufacturingService.simulate(params));
    }

    @PostMapping({"/api/v1/manufacturing/report", "/api/manufacturing/report"})
    public ResponseEntity<byte[]> generateReport(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        Map<String, Object> metrics = (Map<String, Object>) body.getOrDefault("metrics", Map.of(
                "overallOee", "88.4%",
                "dailyOutput", "10,850 / 12,000 units",
                "activeMachines", "22 / 24",
                "plantStatus", "OPERATIONAL"
        ));
        @SuppressWarnings("unchecked")
        List<String> alerts = (List<String>) body.getOrDefault("alerts", List.of(
                "Robotic Weld-Arm joint lock failure detected on Joint 3",
                "Light curtain safety barrier violation detected"
        ));
        String predictions = String.valueOf(body.getOrDefault("predictions", "Predictive maintenance required for Press 500T within 24 hours to prevent hydraulic valve failure."));
        String userNotes = String.valueOf(body.getOrDefault("userNotes", "Shift 1 calibration finished. Overall plant OEE optimal at 88.4%."));

        byte[] pdfBytes = reportGeneratorService.generatePdfReport(metrics, alerts, predictions, userNotes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "IntelliSphere_Manufacturing_Report.pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/api/v1/manufacturing/alerts/{id}/acknowledge")
    public ResponseEntity<Map<String, String>> acknowledgeAlert(@PathVariable UUID id) {
        return ResponseEntity.ok(manufacturingService.acknowledgeAlert(id));
    }

    @PostMapping("/api/v1/manufacturing/alerts/{id}/resolve")
    public ResponseEntity<Map<String, String>> resolveAlert(@PathVariable UUID id) {
        return ResponseEntity.ok(manufacturingService.resolveAlert(id));
    }

    @PostMapping("/api/v1/manufacturing/work-orders")
    public ResponseEntity<Map<String, Object>> createWorkOrder(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(manufacturingService.createWorkOrder(params));
    }

    @PostMapping("/api/v1/manufacturing/optimize-energy")
    public ResponseEntity<Map<String, Object>> optimizeEnergy() {
        return ResponseEntity.ok(manufacturingService.optimizeEnergy());
    }

    // Day 5 AI Extension REST mappings
    @PostMapping("/api/ai/manufacturing/predictive-maintenance")
    public ResponseEntity<Map<String, Object>> getPredictiveMaintenance(@RequestBody Map<String, Object> telemetry) {
        String machine = String.valueOf(telemetry.getOrDefault("machine", "Schuler Press 500T"));
        double temp = Double.parseDouble(String.valueOf(telemetry.getOrDefault("temperature", "68.5")));
        double vib = Double.parseDouble(String.valueOf(telemetry.getOrDefault("vibration", "1.4")));

        String prompt = String.format("Analyze machine telemetry: %s, Operating Temp: %.1f C, Vibration: %.1f mm/s. " +
                "Evaluate failure risk level and suggest immediate corrective steps.", machine, temp, vib);
        
        String analysis = aiService.chat("Predictive Maintenance AI Controller", prompt);
        
        Map<String, Object> result = new HashMap<>();
        result.put("machine", machine);
        result.put("telemetryAnalysis", analysis);
        result.put("riskLevel", (temp > 85.0 || vib > 4.5) ? "HIGH" : "LOW");
        return ResponseEntity.ok(result);
    }

    @PostMapping("/api/ai/manufacturing/root-cause")
    public ResponseEntity<Map<String, Object>> getRootCauseAnalysis(@RequestBody Map<String, Object> incident) {
        String alertTitle = String.valueOf(incident.getOrDefault("alert", "Overheating Warning"));
        String desc = String.valueOf(incident.getOrDefault("description", "Vibration spike on Joint #3 Weld-Arm"));

        String prompt = String.format("You are an industrial root cause diagnostician. Diagnose incident: %s (%s). " +
                "Outline root cause hypothesis, validation action steps, and permanent preventive actions.", alertTitle, desc);
        
        String rootCauseText = aiService.chat("Root Cause Diagnostician Mode", prompt);
        return ResponseEntity.ok(Map.of("incident", alertTitle, "rootCauseAnalysis", rootCauseText));
    }

    @PostMapping({"/api/ai/manufacturing-summary", "/api/ai/manufacturing/production-summary"})
    public ResponseEntity<Map<String, Object>> getProductionSummary(@RequestBody Map<String, Object> metrics) {
        double oee = Double.parseDouble(String.valueOf(metrics.getOrDefault("overallOee", "88.4")));
        double output = Double.parseDouble(String.valueOf(metrics.getOrDefault("currentDailyOutput", "10850")));
        double scrap = Double.parseDouble(String.valueOf(metrics.getOrDefault("scrapUnits", "195")));

        String prompt = String.format("Synthesize factory production performance: OEE of %.1f %%, current output of %.1f units, and scrap of %.1f units. " +
                "Evaluate operational efficiency and write an executive briefing.", oee, output, scrap);
        
        String summary = aiService.chat("Factory Efficiency Analyzer Mode", prompt);
        return ResponseEntity.ok(Map.of("summary", summary, "efficiencyLevel", oee > 85.0 ? "OPTIMAL" : "SUB-OPTIMAL"));
    }

    @PostMapping("/api/ai/manufacturing/trend-forecast")
    public ResponseEntity<Map<String, Object>> getTrendForecast(@RequestBody Map<String, Object> params) {
        @SuppressWarnings("unchecked")
        List<Double> hist = (List<Double>) params.getOrDefault("historicalData", List.of(88.4, 86.2, 85.0, 89.1, 91.2));
        
        Map<String, Object> forecast = aiService.forecastTrends(hist);
        return ResponseEntity.ok(forecast);
    }

    @PostMapping("/api/ai/manufacturing/chat")
    public ResponseEntity<Map<String, String>> chatDirect(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String response = aiService.chat("Manufacturing Line Assistant Context", prompt);
        return ResponseEntity.ok(Map.of("response", response));
    }
}
