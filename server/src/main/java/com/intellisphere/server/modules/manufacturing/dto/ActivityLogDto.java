package com.intellisphere.server.modules.manufacturing.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDto {
    private String id;
    private String title;
    private String description;
    private String type; // MACHINE, MAINTENANCE, SHIFT, ALERT, SYSTEM
    private String timestamp;
    private String operator;
}
