package com.intellisphere.server.modules.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiService {

    @Value("${intellisphere.gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    @SuppressWarnings("rawtypes")
    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.trim().isEmpty() || "mock".equalsIgnoreCase(apiKey)) {
            return getFallbackResponse(prompt);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct Gemini Request Payload
            Map<String, Object> textPart = Map.of("text", prompt);
            Map<String, Object> contentPart = Map.of("parts", List.of(textPart));
            Map<String, Object> payload = Map.of("contents", List.of(contentPart));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    GEMINI_API_URL + apiKey,
                    entity,
                    Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List candidates = (List) response.getBody().get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    if (content != null) {
                        List parts = (List) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            Map part = (Map) parts.get(0);
                            return (String) part.get("text");
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Gemini API call failed, falling back to mock: " + e.getMessage());
        }

        return getFallbackResponse(prompt);
    }

    private String getFallbackResponse(String prompt) {
        String lower = prompt.toLowerCase();

        if (lower.contains("agriculture") || lower.contains("soil") || lower.contains("crop")) {
            return "### Executive Summary\n" +
                    "The simulated agricultural telemetry indicators display a slight hydration deficit across Sector 4B. Recommended mitigations involve scheduling local drip loops.\n\n"
                    +
                    "### Key Findings\n" +
                    "- Soil hydration index is currently at 58% (Threshold: 65% optimal).\n" +
                    "- Daily water utility volume reached 45,000 gallons.\n\n" +
                    "### Recommendations\n" +
                    "1. Activate drip irrigation loops on Sector 4B for 45 minutes during evening hours.\n" +
                    "2. Calibrate localized moisture detectors to resolve anomalous readings.";
        }

        if (lower.contains("report") || lower.contains("summary")) {
            return "### Executive Summary\n" +
                    "This automated brief highlights core operational indicators in the active tenant. Yield trends are currently positive.\n\n"
                    +
                    "### Action Plan\n" +
                    "- Monitor sector alerts.\n" +
                    "- Keep sensor devices calibrated to prevent data fluctuations.";
        }

        return "IntelliSphere AI Decision engine response: Operational parameters analyzed. Risk assessment matches index: LOW. Recommended action: Proceed with standard scheduling loops.";
    }
}
