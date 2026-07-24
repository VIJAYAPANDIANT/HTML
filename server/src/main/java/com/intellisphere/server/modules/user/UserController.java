package com.intellisphere.server.modules.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser() {
        Map<String, Object> user = new HashMap<>();
        user.put("id", "usr-882");
        user.put("email", "admin@intellisphere.com");
        user.put("firstName", "John");
        user.put("lastName", "Doe");
        user.put("role", "ADMIN");
        return ResponseEntity.ok(user);
    }

    @PutMapping("/me")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestBody Map<String, Object> profile) {
        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Profile updated successfully");
        return ResponseEntity.ok(response);
    }
}
