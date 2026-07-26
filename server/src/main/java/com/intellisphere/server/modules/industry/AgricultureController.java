package com.intellisphere.server.modules.industry;

import com.intellisphere.server.modules.ai.AIService;
import com.intellisphere.server.modules.weather.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class AgricultureController {

    private final AIService aiService;
    private final WeatherService weatherService;

    @Autowired
    public AgricultureController(AIService aiService, WeatherService weatherService) {
        this.aiService = aiService;
        this.weatherService = weatherService;
    }

    @GetMapping("/api/v1/industry/agriculture/dashboard")
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

    @PostMapping("/api/v1/industry/agriculture/simulate")
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

    // Direct concept API mappings requested in Prompt 7-10 UI Outline
    @GetMapping("/api/agriculture/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardApi() {
        return getDashboardData();
    }

    @GetMapping("/api/agriculture/farms")
    public ResponseEntity<List<Map<String, Object>>> getFarms() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "f1", "name", "Fresno Sector 1A", "acreage", 120, "location", "Central Valley"),
            Map.of("id", "f2", "name", "Sanger Sector 2B", "acreage", 80, "location", "East Fresno"),
            Map.of("id", "f3", "name", "Clovis Sector 3C", "acreage", 50, "location", "North Clovis")
        ));
    }

    @GetMapping("/api/agriculture/weather")
    public ResponseEntity<Map<String, Object>> getAgricultureWeather() {
        return ResponseEntity.ok(weatherService.getLiveWeather());
    }

    @GetMapping("/api/agriculture/predictions")
    public ResponseEntity<List<Map<String, Object>>> getAgriculturePredictions() {
        return ResponseEntity.ok(List.of(
            Map.of("id", "p1", "crop", "Corn", "predictedYield", "12.4 Tons", "confidence", 0.91),
            Map.of("id", "p2", "crop", "Wheat", "predictedYield", "24.5 Tons", "confidence", 0.94)
        ));
    }

    @PostMapping("/api/agriculture/upload")
    public ResponseEntity<Map<String, Object>> uploadTelemetry(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(Map.of(
            "status", "Ingested", 
            "fileName", body.getOrDefault("fileName", "telemetry.csv"), 
            "timestamp", new java.util.Date().toString()
        ));
    }
}
