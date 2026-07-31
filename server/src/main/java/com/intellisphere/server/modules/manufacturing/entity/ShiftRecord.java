package com.intellisphere.server.modules.manufacturing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "mfg_shift_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShiftRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    private String shiftName; // Shift 1 (Morning), Shift 2 (Afternoon), Shift 3 (Night)

    @Column(nullable = false)
    private LocalDate shiftDate;

    private String supervisor;

    private int targetUnits;

    private int actualUnits;

    private int downtimeMinutes;

    private double oeePercentage;

    private String shiftStatus; // COMPLETED, ACTIVE, UPCOMING
}
