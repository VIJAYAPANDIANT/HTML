package com.intellisphere.server.modules.industry;

import com.intellisphere.server.modules.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/industry/manufacturing")
public class ManufacturingController {

    private final AIService aiService;

    @Autowired
    public ManufacturingController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulate(@RequestBody Map<String, Object> params) {
        int machineAge = Integer.parseInt(String.valueOf(params.getOrDefault("machineAgeMonths", "24")));
        double operatingTemp = Double.parseDouble(String.valueOf(params.getOrDefault("operatingTemp", "72.5")));
        
        String context = "Machine Age: " + machineAge + " months, Operating Temp: " + operatingTemp + " C";
        
        Map<String, Object> risks = aiService.predictRisks(context);
        List<String> recommendations = aiService.getRecommendations("Predictive maintenance plan for machine (age: " + machineAge + ")");
        String summary = aiService.generateExecutiveSummary(Map.of("machineAge", machineAge, "operatingTemp", operatingTemp));
        
        Map<String, Object> result = new HashMap<>();
        result.put("industry", "Manufacturing");
        result.put("machineAge", machineAge);
        result.put("operatingTemp", operatingTemp);
        result.put("riskAnalysis", risks);
        result.put("recommendations", recommendations);
        result.put("executiveSummary", summary);
        
        return ResponseEntity.ok(result);
    }
}
