package com.intellisphere.server.modules.dashboard;

import com.intellisphere.server.modules.dashboard.dto.DashboardOverviewDto;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    public DashboardOverviewDto getOverview() {
        // Formulate realistic mock activities list
        List<Map<String, Object>> activities = new ArrayList<>();
        activities.add(Map.of(
                "id", "act-1",
                "type", "AI_RUN",
                "message", "Monte Carlo simulation completed: Asset Rebalancing.",
                "time", "2m ago"
        ));
        activities.add(Map.of(
                "id", "act-2",
                "type", "USER",
                "message", "John Doe edited hosted OpenAI credentials.",
                "time", "40m ago"
        ));
        activities.add(Map.of(
                "id", "act-3",
                "type", "AI_RUN",
                "message", "Healthcare clinic load balancing parameters calculated.",
                "time", "2h ago"
        ));

        // Formulate realistic mock insights list
        List<String> insights = List.of(
                "AI Recommendation: Recalibrate section 2B thermal sensors.",
                "Active Alert: Healthcare clinic load spiked by 12%.",
                "System Event: Daily report sheet Q3 exported successfully.",
                "Optimization: Factory floor downtime reduced by 4.2%."
        );

        return DashboardOverviewDto.builder()
                .organizations(4)
                .alerts(3)
                .predictions(1420)
                .reports(18)
                .recentActivities(activities)
                .aiInsights(insights)
                .build();
    }
}
