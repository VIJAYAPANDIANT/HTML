package com.intellisphere.server.modules.healthcare.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class PatientDto {
    private UUID id;
    private String name;
    private String room;
    private String doctor;
    private String stability;
    private String status;
}
