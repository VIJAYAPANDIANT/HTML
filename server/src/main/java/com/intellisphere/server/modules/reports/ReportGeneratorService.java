package com.intellisphere.server.modules.reports;

import com.intellisphere.server.modules.ai.GeminiService;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Service
public class ReportGeneratorService {

    private final GeminiService geminiService;

    @Autowired
    public ReportGeneratorService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public byte[] generatePdfReport(Map<String, Object> metrics, List<String> alerts, String predictions, String userNotes) {
        // 1. Build prompt for Gemini
        String prompt = "You are a professional enterprise report generator. Create a detailed business report incorporating the following data:\n" +
                "Dashboard Metrics: " + metrics.toString() + "\n" +
                "Active Alerts: " + alerts.toString() + "\n" +
                "AI Predictions: " + predictions + "\n" +
                "Operator Notes: " + userNotes + "\n\n" +
                "Structure the response into these clear sections:\n" +
                "1. Executive Summary\n" +
                "2. Key Findings\n" +
                "3. Operational Recommendations\n" +
                "4. Future Risks\n" +
                "5. Strategic Action Plan\n" +
                "Respond in plain, structured text.";

        String aiAnalysis = geminiService.generateContent(prompt);

        // 2. Build PDF Document using OpenPDF
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Set up corporate fonts
            Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
            Font sectionFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font bodyFont = new Font(Font.HELVETICA, 9, Font.NORMAL);

            String titleText = "INTELLISPHERE DECISION ANALYSIS REPORT";
            String domainText = "Agriculture Optimization Service";
            
            if (metrics != null && (metrics.containsKey("bedOccupancy") || metrics.containsKey("activeEmergencies"))) {
                titleText = "INTELLISPHERE CLINICAL DECISION BRIEF";
                domainText = "Healthcare Optimization Service";
            } else if (metrics != null && (metrics.containsKey("overallOee") || metrics.containsKey("activeMachines"))) {
                titleText = "INTELLISPHERE INDUSTRIAL PRODUCTION BRIEF";
                domainText = "Manufacturing Optimization Service";
            } else if (metrics != null && (metrics.containsKey("aqiIndex") || metrics.containsKey("gridLoad"))) {
                titleText = "INTELLISPHERE SMART CITY ACTION BRIEF";
                domainText = "Municipal Intelligence Service";
            }

            // Add Header Title
            Paragraph title = new Paragraph(titleText, titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            // Add Metadata Section
            document.add(new Paragraph("Generated at: " + new java.util.Date().toString(), bodyFont));
            document.add(new Paragraph("Tenant Workspace: IntelliSphere Global", bodyFont));
            document.add(new Paragraph("Operational Domain: " + domainText, bodyFont));
            document.add(new Paragraph("-------------------------------------------------------------------------------------------------------", bodyFont));

            // Add AI Analysis Text
            String[] paragraphs = aiAnalysis.split("\n\n");
            for (String pText : paragraphs) {
                String cleanText = pText.replace("###", "").replace("##", "").replace("#", "").trim();
                if (cleanText.isEmpty()) continue;
                
                if (pText.trim().startsWith("#") || pText.trim().startsWith("1.") || pText.trim().startsWith("2.") || pText.trim().startsWith("3.") || pText.trim().startsWith("4.") || pText.trim().startsWith("5.")) {
                    Paragraph sec = new Paragraph(cleanText, sectionFont);
                    sec.setSpacingBefore(12);
                    sec.setSpacingAfter(6);
                    document.add(sec);
                } else {
                    Paragraph body = new Paragraph(cleanText, bodyFont);
                    body.setSpacingAfter(8);
                    document.add(body);
                }
            }

            document.close();
        } catch (Exception e) {
            System.err.println("Failed to compile OpenPDF document: " + e.getMessage());
        }

        return out.toByteArray();
    }
}
