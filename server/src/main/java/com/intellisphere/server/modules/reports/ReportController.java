package com.intellisphere.server.modules.reports;

import com.intellisphere.server.modules.reports.dto.ReportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping
public class ReportController {

    private final ReportGeneratorService reportGeneratorService;

    @Autowired
    public ReportController(ReportGeneratorService reportGeneratorService) {
        this.reportGeneratorService = reportGeneratorService;
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
