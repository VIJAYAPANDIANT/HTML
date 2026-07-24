package com.intellisphere.server.modules.industry;

import com.intellisphere.server.modules.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/industry/smartcity")
public class SmartCityController {

    private final AIService aiService;

    @Autowired
    public SmartCityController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulate(@RequestBody Map<String, Object> params) {
        double gridLoad = Double.parseDouble(String.valueOf(params.getOrDefault("gridLoadMegawatts", "150.0")));
        String peakHour = String.valueOf(params.getOrDefault("isPeakHour", "true"));
        
        String context = "Grid Load: " + gridLoad + " MW, Peak Hour: " + peakHour;
        
        Map<String, Object> risks = aiService.predictRisks(context);
        List<String> recommendations = aiService.getRecommendations("Grid balance optimization for " + gridLoad + " MW");
        String summary = aiService.generateExecutiveSummary(Map.of("gridLoad", gridLoad, "isPeakHour", peakHour));
        
        Map<String, Object> result = new HashMap<>();
        result.put("industry", "Smart City");
        result.put("gridLoad", gridLoad);
        result.put("isPeakHour", peakHour);
        result.put("riskAnalysis", risks);
        result.put("recommendations", recommendations);
        result.put("executiveSummary", summary);
        
        return ResponseEntity.ok(result);
    }
}
