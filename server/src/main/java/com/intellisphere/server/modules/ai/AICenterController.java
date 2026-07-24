package com.intellisphere.server.modules.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AICenterController {

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        Map<String, String> response = new HashMap<>();
        // Mock Response to guarantee running without API Keys
        response.put("response", "AI analysis completed for: '" + prompt + "'. Calculated utility: 84.5%.");
        return ResponseEntity.ok(response);
    }
}
