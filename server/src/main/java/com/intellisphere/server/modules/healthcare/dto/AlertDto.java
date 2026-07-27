package com.intellisphere.server.modules.healthcare.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class AlertDto {
    private UUID id;
    private String category;
    private String severity; // 'CRITICAL', 'MEDIUM', 'LOW'
    private String message;
    private String timestamp;
}
