package com.intellisphere.server.modules.reports;

import com.intellisphere.server.modules.reports.dto.ReportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping
public class ReportController {

    private final ReportGeneratorService reportGeneratorService;

    @Autowired
    public ReportController(ReportGeneratorService reportGeneratorService) {
        this.reportGeneratorService = reportGeneratorService;
    }

    @GetMapping("/api/v1/reports")
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

    @PostMapping("/api/v1/reports/generate-pdf")
    public ResponseEntity<byte[]> generatePdf(@RequestBody ReportRequest request) {
        byte[] pdfBytes = reportGeneratorService.generatePdfReport(
                request.getMetrics(),
                request.getAlerts(),
                request.getPredictions(),
                request.getUserNotes()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "IntelliSphere_Report.pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    // Direct conceptual API mapping requested in prompt
    @PostMapping("/api/ai/report")
    public ResponseEntity<byte[]> generatePdfDirect(@RequestBody ReportRequest request) {
        return generatePdf(request);
    }
}
