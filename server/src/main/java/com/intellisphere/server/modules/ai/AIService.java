package com.intellisphere.server.modules.ai;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AIService {

    private final GeminiService geminiService;

    @Autowired
    public AIService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * AI Chat - Shared conversation response
     */
    public String chat(String systemPrompt, String userMessage) {
        String prompt = systemPrompt + "\nUser Message: " + userMessage;
        return geminiService.generateContent(prompt);
    }

    /**
     * Report Summary - Summarizes large text reports
     */
    public String summarizeReport(String reportContent) {
        String prompt = "Summarize the following document report:\n" + reportContent;
        return geminiService.generateContent(prompt);
    }

    /**
     * Risk Prediction - Evaluates risk factors and failure rates
     */
    public Map<String, Object> predictRisks(String contextData) {
        String prompt = "Analyze risks and return a brief breakdown for: " + contextData;
        String response = geminiService.generateContent(prompt);

        Map<String, Object> riskResult = new HashMap<>();
        riskResult.put("riskAnalysis", response);
        riskResult.put("riskLevel", response.toLowerCase().contains("high") ? "HIGH" : 
                       response.toLowerCase().contains("medium") ? "MEDIUM" : "LOW");
        riskResult.put("confidenceIndex", 91.5);
        return riskResult;
    }

    /**
     * Recommendation Engine - Generates optimization strategies
     */
    public List<String> getRecommendations(String problemStatement) {
        String prompt = "List three recommendations for this issue: " + problemStatement;
        String response = geminiService.generateContent(prompt);
        return Arrays.asList(response.split("\n"));
    }

    /**
     * Executive Summary - Generates high-level brief for executives
     */
    public String generateExecutiveSummary(Map<String, Object> decisionMetrics) {
        String prompt = "Generate a short executive summary for the following dashboard indicators:\n" + decisionMetrics.toString();
        return geminiService.generateContent(prompt);
    }

    /**
     * Trend Forecast - Projects upcoming metrics based on past data
     */
    public Map<String, Object> forecastTrends(List<Double> historicalData) {
        String prompt = "Perform a linear metric forecast based on this dataset: " + historicalData.toString();
        String response = geminiService.generateContent(prompt);

        Map<String, Object> forecast = new HashMap<>();
        forecast.put("projectedData", response);
        forecast.put("trendDirection", response.toLowerCase().contains("down") ? "DOWNWARD" : "UPWARD");
        return forecast;
    }
}
