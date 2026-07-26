package com.intellisphere.server.modules.weather;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast?latitude=36.7783&longitude=-119.4179&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation";

    // In-memory cache variables
    private Map<String, Object> cachedWeather = null;
    private long cacheExpiryTime = 0;
    private static final long CACHE_DURATION_MS = 15 * 60 * 1000; // 15 Minutes

    @SuppressWarnings({"rawtypes", "unchecked"})
    public synchronized Map<String, Object> getLiveWeather() {
        long now = System.currentTimeMillis();
        if (cachedWeather != null && now < cacheExpiryTime) {
            return cachedWeather;
        }

        try {
            Map response = restTemplate.getForObject(WEATHER_API_URL, Map.class);
            if (response != null && response.containsKey("current")) {
                Map current = (Map) response.get("current");
                
                Map<String, Object> weatherMetrics = new HashMap<>();
                weatherMetrics.put("temperature", current.getOrDefault("temperature_2m", 26.0) + "°C");
                weatherMetrics.put("humidity", current.getOrDefault("relative_humidity_2m", 60) + "%");
                weatherMetrics.put("windSpeed", current.getOrDefault("wind_speed_10m", 12.5) + " km/h");
                
                double precipitation = Double.parseDouble(String.valueOf(current.getOrDefault("precipitation", 0.0)));
                weatherMetrics.put("rainProbability", precipitation > 0.0 ? "85%" : "10%");
                weatherMetrics.put("outlook", precipitation > 0.0 ? "Rainy" : "Sunny");
                weatherMetrics.put("cachedAt", new Date().toString());

                cachedWeather = weatherMetrics;
                cacheExpiryTime = now + CACHE_DURATION_MS;
                return cachedWeather;
            }
        } catch (Exception e) {
            System.err.println("Open-Meteo API query failed, using fallback current metrics: " + e.getMessage());
        }

        // Fallback default mock weather metrics
        Map<String, Object> fallback = new HashMap<>();
        fallback.put("temperature", "26.5°C");
        fallback.put("humidity", "62%");
        fallback.put("windSpeed", "12.0 km/h");
        fallback.put("rainProbability", "15%");
        fallback.put("outlook", "Clear Sunny");
        fallback.put("cachedAt", new Date().toString() + " (Mock Fallback)");
        return fallback;
    }
}
