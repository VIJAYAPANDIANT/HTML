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

    @PostMapping("/api/ai/smartcity-summary")
    public ResponseEntity<Map<String, Object>> getCitySummary(@RequestBody Map<String, Object> metrics) {
        int aqi = Integer.parseInt(String.valueOf(metrics.getOrDefault("aqiIndex", "64")));
        double gridLoad = Double.parseDouble(String.valueOf(metrics.getOrDefault("gridLoadMw", "142.5")));

        String prompt = String.format("Synthesize city operations performance: Air Quality AQI score of %d (Moderate), and public grid load of %.1f MW. " +
                "Evaluate city sustainability indexes and write an executive briefing.", aqi, gridLoad);
        
        String summary = aiService.chat("City Intelligence Analyzer Mode", prompt);
        return ResponseEntity.ok(Map.of("summary", summary, "sustainabilityIndex", aqi < 100 ? "OPTIMAL" : "SUB-OPTIMAL"));
    }

    @PostMapping("/api/ai/smartcity/optimize-traffic")
    public ResponseEntity<Map<String, Object>> runTrafficOptimization(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(smartCityService.optimizeTraffic(params));
    }

    @PostMapping("/api/ai/smartcity/optimize-grid")
    public ResponseEntity<Map<String, Object>> runGridOptimization(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(smartCityService.optimizeGrid(params));
    }
}
