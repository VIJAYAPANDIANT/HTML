package com.intellisphere.server.modules.healthcare.controller;

import com.intellisphere.server.modules.healthcare.dto.*;
import com.intellisphere.server.modules.healthcare.service.HealthcareService;
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
public class HealthcareApiController {

    private final HealthcareService healthcareService;
    private final ReportGeneratorService reportGeneratorService;
    private final AIService aiService;

    @Autowired
    public HealthcareApiController(HealthcareService healthcareService, 
                                   ReportGeneratorService reportGeneratorService,
                                   AIService aiService) {
        this.healthcareService = healthcareService;
        this.reportGeneratorService = reportGeneratorService;
        this.aiService = aiService;
    }

    @GetMapping("/api/healthcare/dashboard")
    public ResponseEntity<HealthcareDashboardDto> getDashboard() {
        return ResponseEntity.ok(healthcareService.getDashboardData());
    }

    @GetMapping("/api/healthcare/patients")
    public ResponseEntity<List<PatientDto>> getPatients() {
        return ResponseEntity.ok(healthcareService.getPatients());
    }

    @GetMapping("/api/healthcare/alerts")
    public ResponseEntity<List<AlertDto>> getAlerts() {
        return ResponseEntity.ok(healthcareService.getAlerts());
    }

    @PostMapping("/api/healthcare/report")
    public ResponseEntity<byte[]> generateReport(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        Map<String, Object> metrics = (Map<String, Object>) body.getOrDefault("metrics", Map.of("bedOccupancy", "84%"));
        @SuppressWarnings("unchecked")
        List<String> alerts = (List<String>) body.getOrDefault("alerts", List.of("ICU ventilator capacity high"));
        String predictions = String.valueOf(body.getOrDefault("predictions", "N/A"));
        String userNotes = String.valueOf(body.getOrDefault("userNotes", "N/A"));

        byte[] pdfBytes = reportGeneratorService.generatePdfReport(metrics, alerts, predictions, userNotes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "IntelliSphere_Healthcare_Brief.pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/api/ai/healthcare-summary")
    public ResponseEntity<Map<String, String>> generateSummary(@RequestBody Map<String, Object> patientData) {
        String name = String.valueOf(patientData.getOrDefault("name", "Unknown Patient"));
        String stability = String.valueOf(patientData.getOrDefault("stability", "90%"));
        String symptoms = String.valueOf(patientData.getOrDefault("symptoms", "Elevated blood pressure"));

        String prompt = "Generate a clinical summary report brief for patient " + name + " (Stability: " + stability + "). " +
                "Patient exhibits these symptoms: " + symptoms + ". Outline care recommendations.";

        String aiResponse = aiService.chat("Clinical Summary Mode", prompt);
        return ResponseEntity.ok(Map.of("summary", aiResponse));
    }

    // Merged GIS mapping references from raw controller
    @GetMapping("/api/healthcare/hospitals")
    public ResponseEntity<List<Map<String, Object>>> getHospitals() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "h1", "name", "IntelliSphere Central Medical Center", "lat", 36.7820, "lng", -119.4200, "beds", 150),
            Map.of("id", "h2", "name", "East Fresno Emergency Clinic", "lat", 36.7750, "lng", -119.4120, "beds", 60),
            Map.of("id", "h3", "name", "Clovis Pediatric & General", "lat", 36.7840, "lng", -119.4080, "beds", 80)
        ));
    }

    @GetMapping("/api/healthcare/predictions")
    public ResponseEntity<Map<String, Object>> getPredictions() {
        Map<String, Object> pred = new HashMap<>();
        pred.put("erWaitPrediction", "Wait time expected to rise by 8 mins over next 2 hours due to regional load conditions.");
        pred.put("bedShortageProbability", "Shortage probability: 14.5% (LOW).");
        return ResponseEntity.ok(pred);
    }

    @PostMapping("/api/healthcare/simulate-triage")
    public ResponseEntity<Map<String, Object>> simulateTriage(@RequestBody Map<String, Object> symptoms) {
        String inputSymptoms = String.valueOf(symptoms.getOrDefault("symptoms", "Chest tightness & elevated pulse"));
        
        String prompt = "You are a clinical triage classifier. Evaluate these symptoms: " + inputSymptoms + 
                "\nRespond in a structured text explaining priority category (Critical/High/Medium/Low), expected wait pathway, and initial diagnostics check (ECG, blood panel, etc).";
        
        String aiResponse = aiService.chat("Clinical Triage Mode", prompt);
        
        Map<String, Object> result = new HashMap<>();
        result.put("symptoms", inputSymptoms);
        result.put("triageOutput", aiResponse);
        result.put("priorityLevel", aiResponse.contains("Critical") ? "Critical" : aiResponse.contains("High") ? "High" : "Medium");
        
        return ResponseEntity.ok(result);
    }

    @PostMapping("/api/v1/industry/healthcare/simulate")
    public ResponseEntity<Map<String, Object>> simulate(@RequestBody Map<String, Object> params) {
        int staffCount = Integer.parseInt(String.valueOf(params.getOrDefault("staffCount", "12")));
        int patientLoad = Integer.parseInt(String.valueOf(params.getOrDefault("patientLoad", "85")));
        
        String context = "Staff Count: " + staffCount + ", Patient Load: " + patientLoad;
        
        Map<String, Object> risks = aiService.predictRisks(context);
        List<String> recommendations = aiService.getRecommendations("Optimize scheduling and staff patterns for patient load " + patientLoad);
        String summary = aiService.generateExecutiveSummary(Map.of("staffCount", staffCount, "patientLoad", patientLoad));
        
        Map<String, Object> result = new HashMap<>();
        result.put("industry", "Healthcare");
        result.put("staffCount", staffCount);
        result.put("patientLoad", patientLoad);
        result.put("riskAnalysis", risks);
        result.put("recommendations", recommendations);
        result.put("executiveSummary", summary);
        
        return ResponseEntity.ok(result);
    }
}
