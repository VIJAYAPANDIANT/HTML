package com.intellisphere.server.modules.dashboard;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("activeDecisions", 12);
        metrics.put("totalOrganizations", 4);
        metrics.put("confidenceIndex", 98.4);
        metrics.put("simulationsRun", 1420);
        return ResponseEntity.ok(metrics);
    }
}
