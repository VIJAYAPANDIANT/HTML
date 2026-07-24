package com.intellisphere.server.modules.analytics;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    @GetMapping("/scenarios")
    public ResponseEntity<List<Map<String, Object>>> getScenarios() {
        List<Map<String, Object>> scenarios = new ArrayList<>();
        Map<String, Object> sc1 = new HashMap<>();
        sc1.put("id", "sc-101");
        sc1.put("name", "Asset Allocation Model v1.2");
        sc1.put("probabilityScore", 0.89);
        scenarios.add(sc1);
        return ResponseEntity.ok(scenarios);
    }
}
