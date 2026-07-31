package com.intellisphere.server.modules.manufacturing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mfg_alerts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManufacturingAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // Vibration Spike, Overheating, Quality Drop, Power Surge, Maintenance Due

    @Column(nullable = false)
    private String severity; // CRITICAL, WARNING, INFO

    @Column(nullable = false)
    private String message;

    private String machineCode;

    private String status = "ACTIVE"; // ACTIVE, ACKNOWLEDGED, RESOLVED

    private LocalDateTime createdAt = LocalDateTime.now();
}
