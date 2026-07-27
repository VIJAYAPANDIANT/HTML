package com.intellisphere.server.modules.healthcare.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "hospitals")
@Data
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String location;

    @Column(name = "beds_total")
    private Integer bedsTotal = 100;
}
