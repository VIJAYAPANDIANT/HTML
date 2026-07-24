package com.intellisphere.server.modules.organization;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/organizations")
public class OrganizationController {

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getOrganizations() {
        List<Map<String, Object>> orgs = new ArrayList<>();
        
        Map<String, Object> org1 = new HashMap<>();
        org1.put("name", "IntelliSphere Global");
        org1.put("domain", "global.intellisphere.com");
        org1.put("members", 42);
        org1.put("role", "Owner");
        orgs.add(org1);

        Map<String, Object> org2 = new HashMap<>();
        org2.put("name", "Acme Research Labs");
        org2.put("domain", "acme.io");
        org2.put("members", 15);
        org2.put("role", "Admin");
        orgs.add(org2);

        return ResponseEntity.ok(orgs);
    }
}
