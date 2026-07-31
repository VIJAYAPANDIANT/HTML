package com.intellisphere.server.modules.manufacturing.controller;

import com.intellisphere.server.modules.manufacturing.dto.*;
import com.intellisphere.server.modules.manufacturing.service.ManufacturingService;
import com.intellisphere.server.modules.reports.ReportGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/manufacturing")
public class ManufacturingApiController {

    private final ManufacturingService manufacturingService;
    private final ReportGeneratorService reportGeneratorService;

    @Autowired
    public ManufacturingApiController(ManufacturingService manufacturingService,
                                        ReportGeneratorService reportGeneratorService) {
        this.manufacturingService = manufacturingService;
        this.reportGeneratorService = reportGeneratorService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ManufacturingDashboardDto> getDashboard() {
        return ResponseEntity.ok(manufacturingService.getDashboardData());
    }

    @GetMapping("/machines")
    public ResponseEntity<List<MachineStatusDto>> getMachines() {
        return ResponseEntity.ok(manufacturingService.getMachines());
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> runSimulation(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(manufacturingService.simulate(params));
    }

    @PostMapping("/report")
    public ResponseEntity<byte[]> generateReport(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        Map<String, Object> metrics = (Map<String, Object>) body.getOrDefault("metrics", Map.of(
                "overallOee", "88.4%",
                "dailyOutput", "10,850 / 12,000 units",
                "activeMachines", "22 / 24",
                "plantStatus", "OPERATIONAL"
        ));
        @SuppressWarnings("unchecked")
        List<String> alerts = (List<String>) body.getOrDefault("alerts", List.of(
                "Stamping Press 500T temperature high (94.8°C)",
                "KUKA Weld-Arm 4 joint vibration spike"
        ));
        String predictions = String.valueOf(body.getOrDefault("predictions", "Predictive maintenance required for Press 500T within 24 hours to prevent hydraulic valve failure."));
        String userNotes = String.valueOf(body.getOrDefault("userNotes", "Shift 1 calibration finished. Overall plant OEE optimal at 88.4%."));

        byte[] pdfBytes = reportGeneratorService.generatePdfReport(metrics, alerts, predictions, userNotes);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "IntelliSphere_Manufacturing_Report.pdf");
        headers.setContentLength(pdfBytes.length);

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @PostMapping("/alerts/{id}/acknowledge")
    public ResponseEntity<Map<String, String>> acknowledgeAlert(@PathVariable UUID id) {
        return ResponseEntity.ok(manufacturingService.acknowledgeAlert(id));
    }

    @PostMapping("/alerts/{id}/resolve")
    public ResponseEntity<Map<String, String>> resolveAlert(@PathVariable UUID id) {
        return ResponseEntity.ok(manufacturingService.resolveAlert(id));
    }

    @PostMapping("/work-orders")
    public ResponseEntity<Map<String, Object>> createWorkOrder(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(manufacturingService.createWorkOrder(params));
    }

    @PostMapping("/optimize-energy")
    public ResponseEntity<Map<String, Object>> optimizeEnergy() {
        return ResponseEntity.ok(manufacturingService.optimizeEnergy());
    }
}
