package com.intellisphere.server.modules.manufacturing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mfg_machines")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String machineCode;

    @Column(nullable = false)
    private String type; // e.g. CNC Lathe, Robotic Arm, Stamping Press, Hydraulic Pump, Conveyor

    @Column(nullable = false)
    private String productionLine; // e.g. Line A - Stamping

    @Column(nullable = false)
    private String status; // OPERATIONAL, WARNING, CRITICAL, MAINTENANCE, IDLE

    private int healthScore; // 0 - 100

    private double temperature; // °C

    private double vibration; // mm/s

    private double spindleSpeed; // RPM

    private double hydraulicPressure; // PSI

    private int ageMonths;

    private LocalDateTime lastMaintenanceDate;

    private LocalDateTime nextScheduledMaintenance;
}
