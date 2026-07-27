package com.intellisphere.server.modules.industry;

import com.intellisphere.server.modules.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class HealthcareController {

    private final AIService aiService;

    @Autowired
    public HealthcareController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/api/healthcare/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = new HashMap<>();

        // Hospital KPIs
        data.put("bedOccupancy", "84%");
        data.put("activeEmergencies", "14 Cases");
        data.put("avgWaitTime", "18m");
        data.put("activeStaff", "48");

        // Emergency Monitoring cases
        data.put("emergencies", List.of(
            Map.of("id", "e1", "category", "Trauma (Field 2)", "severity", "Critical", "triage", "Level 1 (Immediate)", "arrival", "3m ago"),
            Map.of("id", "e2", "category", "Stroke Suspected", "severity", "High", "triage", "Level 2 (Emergent)", "arrival", "12m ago"),
            Map.of("id", "e3", "category", "Cardiac Arrythmia", "severity", "High", "triage", "Level 2 (Emergent)", "arrival", "25m ago"),
            Map.of("id", "e4", "category", "Minor Fracture", "severity", "Low", "triage", "Level 4 (Non-Urgent)", "arrival", "1h ago")
        ));

        // Patient Overview roster
        data.put("patients", List.of(
            Map.of("id", "pt1", "name", "John Doe", "room", "ICU-102", "doctor", "Dr. Sarah Jenkins", "stability", "89%"),
            Map.of("id", "pt2", "name", "Alice Vance", "room", "Gen-304", "doctor", "Dr. Marcus Vance", "stability", "95%"),
            Map.of("id", "pt3", "name", "Robert Miller", "room", "Cardiac-201", "doctor", "Dr. James Carter", "stability", "74%")
        ));

        // Bed occupancy grid layout
        data.put("bedGrid", List.of(
            Map.of("room", "101", "type", "ICU", "status", "OCCUPIED"),
            Map.of("room", "102", "type", "ICU", "status", "OCCUPIED_CRITICAL"),
            Map.of("room", "103", "type", "ICU", "status", "UNOCCUPIED"),
            Map.of("room", "201", "type", "CCU", "status", "OCCUPIED"),
            Map.of("room", "202", "type", "CCU", "status", "UNOCCUPIED"),
            Map.of("room", "301", "type", "Gen", "status", "OCCUPIED"),
            Map.of("room", "302", "type", "Gen", "status", "UNOCCUPIED"),
            Map.of("room", "303", "type", "Gen", "status", "UNOCCUPIED"),
            Map.of("room", "304", "type", "Gen", "status", "OCCUPIED")
        ));

        // Healthcare AI Recommendations
        data.put("aiRecommendations", List.of(
            "Shunt incoming stroke alerts to the neuro-care overflow wing.",
            "Reprioritize shift schedules for cardiac nursing blocks.",
            "ICU ventilator capacity is at 90%. Prep emergency routing pathways."
        ));

        return ResponseEntity.ok(data);
    }

    @GetMapping("/api/healthcare/hospitals")
    public ResponseEntity<List<Map<String, Object>>> getHospitals() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "h1", "name", "IntelliSphere Central Medical", "lat", 36.7820, "lng", -119.4200, "beds", 150),
            Map.of("id", "h2", "name", "East Fresno Emergency Clinic", "lat", 36.7750, "lng", -119.4120, "beds", 60),
            Map.of("id", "h3", "name", "Clovis Pediatric & General", "lat", 36.7840, "lng", -119.4080, "beds", 80)
        ));
    }

    @GetMapping("/api/healthcare/predictions")
    public ResponseEntity<Map<String, Object>> getPredictions() {
        Map<String, Object> pred = new HashMap<>();
        pred.put("erWaitPrediction", "Wait time expected to rise by 8 mins over next 2 hours due to regional temperature alerts.");
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
}
