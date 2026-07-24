package com.intellisphere.server.modules.report;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getReports() {
        List<Map<String, Object>> reports = new ArrayList<>();
        
        Map<String, Object> r1 = new HashMap<>();
        r1.put("title", "Global Resource Optimization Plan Q3");
        r1.put("date", "2026-07-22");
        r1.put("type", "PDF Report");
        r1.put("size", "2.4 MB");
        reports.add(r1);

        Map<String, Object> r2 = new HashMap<>();
        r2.put("title", "Liquidity & Capital Structure Stress Test");
        r2.put("date", "2026-07-18");
        r2.put("type", "Excel Sheet");
        r2.put("size", "15.1 MB");
        reports.add(r2);

        return ResponseEntity.ok(reports);
    }
}
