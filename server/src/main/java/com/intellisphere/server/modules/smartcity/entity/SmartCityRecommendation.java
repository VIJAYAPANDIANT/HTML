package com.intellisphere.server.modules.smartcity.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "sc_recommendations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SmartCityRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String suggestion;

    private String impact = "MEDIUM"; // HIGH, MEDIUM, LOW

    private String estimatedSavings;

    private LocalDateTime createdAt = LocalDateTime.now();
}
