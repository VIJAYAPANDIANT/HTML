package com.intellisphere.server.modules.industry;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/industry")
public class IndustryController {

    @GetMapping("/modules")
    public ResponseEntity<List<Map<String, Object>>> getModules() {
        List<Map<String, Object>> modules = new ArrayList<>();

        Map<String, Object> m1 = new HashMap<>();
        m1.put("title", "Financial Modeling");
        m1.put("active", true);
        m1.put("desc", "Optimize asset allocation and options pricing models.");
        modules.add(m1);

        Map<String, Object> m2 = new HashMap<>();
        m2.put("title", "Supply Chain & Logistics");
        m2.put("active", true);
        m2.put("desc", "Simulate route disruptions and warehouse storage allocations.");
        modules.add(m2);

        return ResponseEntity.ok(modules);
    }
}
