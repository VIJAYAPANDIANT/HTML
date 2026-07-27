package com.intellisphere.server.modules.healthcare.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "beds")
@Data
public class Bed {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Column(name = "bed_number", nullable = false)
    private String bedNumber;

    @Column(nullable = false)
    private String status = "UNOCCUPIED";
}
