package com.intellisphere.server.modules.smartcity.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sc_citizen_complaints")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CitizenComplaint {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category; // TRAFFIC, POLLUTION, WASTE, WATER, ENERGY, INFRASTRUCTURE

    @Builder.Default
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED

    @Builder.Default
    private String reporterName = "Anonymous";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
