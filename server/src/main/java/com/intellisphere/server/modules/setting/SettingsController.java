package com.intellisphere.server.modules.setting;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/settings")
public class SettingsController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSettings() {
        Map<String, Object> settings = new HashMap<>();
        settings.put("firstName", "John");
        settings.put("lastName", "Doe");
        settings.put("email", "admin@intellisphere.com");
        return ResponseEntity.ok(settings);
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> updateSettings(@RequestBody Map<String, Object> newSettings) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Settings saved successfully");
        return ResponseEntity.ok(response);
    }
}
