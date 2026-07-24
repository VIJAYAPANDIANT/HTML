package com.intellisphere.server.modules.industry;

import com.intellisphere.server.modules.ai.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/industry/healthcare")
public class HealthcareController {

    private final AIService aiService;

    @Autowired
    public HealthcareController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulate(@RequestBody Map<String, Object> params) {
        int staffCount = Integer.parseInt(String.valueOf(params.getOrDefault("staffCount", "10")));
        int patientLoad = Integer.parseInt(String.valueOf(params.getOrDefault("patientLoad", "80")));
        
        String context = "Staff Count: " + staffCount + ", Patient Load: " + patientLoad;
        
        Map<String, Object> risks = aiService.predictRisks(context);
        List<String> recommendations = aiService.getRecommendations("Optimize scheduling for " + patientLoad + " patients");
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
