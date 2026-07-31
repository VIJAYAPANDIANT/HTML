package com.intellisphere.server.modules.manufacturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ManufacturingAlertDto {
    private UUID id;
    private String title;
    private String category;
    private String severity; // CRITICAL, WARNING, INFO
    private String message;
    private String machineCode;
    private String status; // ACTIVE, ACKNOWLEDGED, RESOLVED
    private String timestamp;
}
