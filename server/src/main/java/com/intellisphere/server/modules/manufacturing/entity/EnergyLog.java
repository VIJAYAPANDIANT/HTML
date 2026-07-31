package com.intellisphere.server.modules.manufacturing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mfg_energy_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnergyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private double totalKwh;

    private double costUsd;

    private double efficiencyKwhPerUnit;

    private double peakDemandMw;

    private double carbonFootprintKg;

    private boolean peakWarning;
}
