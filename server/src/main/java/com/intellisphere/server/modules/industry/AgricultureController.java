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
