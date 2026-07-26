package com.intellisphere.server.modules.industry;

import com.intellisphere.server.modules.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/industry/agriculture")
public class AgricultureController {

    private final AIService aiService;

    @Autowired
    public AgricultureController(AIService aiService) {
        this.aiService = aiService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        Map<String, Object> data = new HashMap<>();
        
        // Farm Overview Metrics
        data.put("activeArea", "250 Acres");
        data.put("waterConsumption", "45k Gal");
        data.put("soilHydration", "68%");
        data.put("yieldForecast", "94.2%");

        // Soil Health Cards Data
        data.put("nitrogen", Map.of("value", "42 mg/kg", "status", "Optimal"));
        data.put("phosphorus", Map.of("value", "18 mg/kg", "status", "Warning"));
        data.put("potassium", Map.of("value", "125 mg/kg", "status", "Optimal"));
        data.put("ph", Map.of("value", "6.8", "status", "Optimal"));
        data.put("moisture", Map.of("value", "32%", "status", "Optimal"));
        data.put("temperature", Map.of("value", "22.5 C", "status", "Optimal"));

        // Weather Summary
        data.put("weatherTemp", "26 C");
        data.put("weatherHumidity", "62%");
        data.put("weatherWind", "12 km/h");
        data.put("weatherOutlook", "Sunny");

        // Crop Monitoring List
        data.put("crops", List.of(
            Map.of("crop", "Wheat", "area", "120 Acres", "stage", "Flowering", "health", "Excellent"),
            Map.of("crop", "Corn", "area", "80 Acres", "stage", "Vegetative", "health", "Good"),
            Map.of("crop", "Soybeans", "area", "50 Acres", "stage", "Maturation", "health", "Warning")
        ));

        // Irrigation and Alerts
        data.put("irrigationSystem", "ONLINE");
        data.put("activeAlerts", List.of(
            "Low Soil hydration detected in Sector 4B.",
            "Phosphorus depletion risk highlighted in soil card."
        ));

        return ResponseEntity.ok(data);
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulate(@RequestBody Map<String, Object> params) {
        String cropType = String.valueOf(params.getOrDefault("cropType", "Wheat"));
        String hydration = String.valueOf(params.getOrDefault("soilHydration", "Low"));
        
        String context = "Crop: " + cropType + ", Soil Hydration: " + hydration;
        
        Map<String, Object> risks = aiService.predictRisks(context);
        List<String> recommendations = aiService.getRecommendations("Optimize irrigation scheduler for " + cropType);
        String summary = aiService.generateExecutiveSummary(Map.of("cropType", cropType, "soilHydration", hydration));
        
        Map<String, Object> result = new HashMap<>();
        result.put("industry", "Agriculture");
        result.put("cropType", cropType);
        result.put("riskAnalysis", risks);
        result.put("recommendations", recommendations);
        result.put("executiveSummary", summary);
        
        return ResponseEntity.ok(result);
    }
}
