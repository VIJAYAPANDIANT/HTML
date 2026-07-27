package com.intellisphere.server.modules.healthcare.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Table(name = "patients")
@Data
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "admission_status")
    private String admissionStatus = "ADMITTED";

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "stability_index")
    private Double stabilityIndex = 100.0;
}
