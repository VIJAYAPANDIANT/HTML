package com.intellisphere.server.modules.industry;

import com.intellisphere.server.modules.manufacturing.service.ManufacturingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/industry/manufacturing")
public class ManufacturingController {

    private final ManufacturingService manufacturingService;

    @Autowired
    public ManufacturingController(ManufacturingService manufacturingService) {
        this.manufacturingService = manufacturingService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<Map<String, Object>> simulate(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok(manufacturingService.simulate(params));
    }
}
