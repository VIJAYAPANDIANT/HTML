package com.intellisphere.server.modules.healthcare.service;

import com.intellisphere.server.modules.healthcare.dto.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class HealthcareService {

    public HealthcareDashboardDto getDashboardData() {
        HealthcareDashboardDto dto = new HealthcareDashboardDto();
        dto.setTotalPatients(182);
        dto.setAvailableBeds(28);
        dto.setEmergencyCases(14);
        dto.setActiveStaff(48);

        // Map Patient DTOs
        PatientDto p1 = new PatientDto();
        p1.setId(UUID.randomUUID());
        p1.setName("John Doe");
        p1.setRoom("ICU-102");
        p1.setDoctor("Dr. Sarah Jenkins");
        p1.setStability("89%");
        p1.setStatus("ADMITTED");

        PatientDto p2 = new PatientDto();
        p2.setId(UUID.randomUUID());
        p2.setName("Alice Vance");
        p2.setRoom("Gen-304");
        p2.setDoctor("Dr. Marcus Vance");
        p2.setStability("95%");
        p2.setStatus("ADMITTED");

        PatientDto p3 = new PatientDto();
        p3.setId(UUID.randomUUID());
        p3.setName("Robert Miller");
        p3.setRoom("Cardiac-201");
        p3.setDoctor("Dr. James Carter");
        p3.setStability("74%");
        p3.setStatus("CRITICAL");

        dto.setPatients(List.of(p1, p2, p3));

        // Map Alert DTOs
        AlertDto a1 = new AlertDto();
        a1.setId(UUID.randomUUID());
        a1.setCategory("Water Shortage");
        a1.setSeverity("CRITICAL");
        a1.setMessage("Severe clinical hydration warning flagged in ICU Sector 4.");
        a1.setTimestamp("10m ago");

        AlertDto a2 = new AlertDto();
        a2.setId(UUID.randomUUID());
        a2.setCategory("Disease Risk");
        a2.setSeverity("MEDIUM");
        a2.setMessage("Foliage density scan indicates potential airborne viral risk in Ward A.");
        a2.setTimestamp("1h ago");

        dto.setAlerts(List.of(a1, a2));

        // Set Bed Status Grid
        dto.setBedGrid(List.of(
            Map.of("room", "101", "type", "ICU", "status", "OCCUPIED"),
            Map.of("room", "102", "type", "ICU", "status", "OCCUPIED_CRITICAL"),
            Map.of("room", "103", "type", "ICU", "status", "UNOCCUPIED"),
            Map.of("room", "201", "type", "CCU", "status", "OCCUPIED"),
            Map.of("room", "202", "type", "CCU", "status", "UNOCCUPIED"),
            Map.of("room", "301", "type", "Gen", "status", "OCCUPIED"),
            Map.of("room", "302", "type", "Gen", "status", "UNOCCUPIED")
        ));

        // Recommendations
        dto.setAiRecommendations(List.of(
            "Shunt incoming stroke alerts to the neuro-care overflow wing.",
            "Reprioritize shift schedules for cardiac nursing blocks.",
            "ICU ventilator capacity is at 90%. Prep emergency routing pathways."
        ));

        // Department Analytics data mapping
        dto.setDepartmentAnalytics(Map.of(
            "departments", List.of("ER", "ICU", "Pediatrics", "Cardiology"),
            "admissions", List.of(45, 28, 32, 19)
        ));

        return dto;
    }

    public List<PatientDto> getPatients() {
        return getDashboardData().getPatients();
    }

    public List<AlertDto> getAlerts() {
        return getDashboardData().getAlerts();
    }
}
