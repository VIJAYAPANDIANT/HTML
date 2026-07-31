package com.intellisphere.server.modules.manufacturing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "mfg_maintenance_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String workOrderNumber;

    @Column(nullable = false)
    private String machineName;

    @Column(nullable = false)
    private String issueDescription;

    @Column(nullable = false)
    private String priority; // CRITICAL, HIGH, MEDIUM, LOW

    @Column(nullable = false)
    private String status; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    private double failureProbability; // 0 - 100 %

    private String assignedTechnician;

    private int estimatedDurationHours;

    private LocalDateTime scheduledDate;
}
