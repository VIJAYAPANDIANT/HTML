package com.intellisphere.server.modules.notification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getNotifications() {
        List<Map<String, Object>> list = new ArrayList<>();

        Map<String, Object> al1 = new HashMap<>();
        al1.put("text", "Model optimization run completed successfully: Asset Rebalancing.");
        al1.put("type", "success");
        al1.put("time", "10 mins ago");
        list.add(al1);

        Map<String, Object> al2 = new HashMap<>();
        al2.put("text", "Unusual boundary inputs detected in Monte Carlo pipeline. Results may be skewed.");
        al2.put("type", "warning");
        al2.put("time", "1 hour ago");
        list.add(al2);

        return ResponseEntity.ok(list);
    }
}
