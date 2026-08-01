package com.intellisphere.server.modules.smartcity.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sc_alerts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SmartCityAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // e.g. TRAFFIC, POWER_GRID, WATER_MAIN

    @Column(nullable = false)
    private String severity; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    private String status = "ACTIVE"; // ACTIVE, ACKNOWLEDGED, RESOLVED

    private LocalDateTime createdAt = LocalDateTime.now();
}
