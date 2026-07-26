package com.intellisphere.server.modules.reports.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class ReportRequest {
    private Map<String, Object> metrics;
    private List<String> alerts;
    private String predictions;
    private String userNotes;
}
