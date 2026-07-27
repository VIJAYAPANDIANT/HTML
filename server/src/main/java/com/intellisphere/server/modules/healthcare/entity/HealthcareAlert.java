package com.intellisphere.server.modules.healthcare.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "healthcare_alerts")
@Data
public class HealthcareAlert {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(nullable = false)
    private String severity; // 'CRITICAL', 'MEDIUM', 'LOW'

    @Column(nullable = false)
    private String message;

    @Column(name = "is_resolved")
    private Boolean isResolved = false;
}
