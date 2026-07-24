package com.intellisphere.server.modules.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
public class AICenterController {

    private final AIService aiService;

    @Autowired
    public AICenterController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String prompt = request.get("prompt");
        String responseText = aiService.chat("System Context", prompt);
        return ResponseEntity.ok(Map.of("response", responseText));
    }
}
