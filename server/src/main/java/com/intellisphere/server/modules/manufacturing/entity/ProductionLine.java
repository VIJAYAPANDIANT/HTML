package com.intellisphere.server.modules.manufacturing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "mfg_production_lines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductionLine {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name; // e.g. Line A - Stamping

    @Column(nullable = false)
    private String category; // Stamping, Welding, Assembly, Inspection

    @Column(nullable = false)
    private String status; // OPERATIONAL, DEGRADED, MAINTENANCE, IDLE

    private int targetOutput;

    private int actualOutput;

    private int scrapUnits;

    private double oeeScore; // percentage

    private double throughputPerHour;

    private String leadSupervisor;
}
