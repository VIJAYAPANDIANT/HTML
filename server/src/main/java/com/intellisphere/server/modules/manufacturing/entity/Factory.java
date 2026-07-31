package com.intellisphere.server.modules.manufacturing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Entity
@Table(name = "mfg_factories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Factory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    private String status = "OPERATIONAL";

    private double oeePercentage = 87.5;

    private int activeLines = 4;

    private int totalMachines = 24;

    private int activeWorkers = 142;

    private double dailyOutputTarget = 12000.0;

    private double currentDailyOutput = 10850.0;
}
