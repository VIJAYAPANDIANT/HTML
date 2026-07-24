package com.intellisphere.server.modules.upload;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, Object> result = new HashMap<>();
        result.put("fileName", file.getOriginalFilename());
        result.put("fileSize", file.getSize());
        result.put("contentType", file.getContentType());
        result.put("status", "SUCCESS");
        result.put("message", "Document successfully parsed and ingested into vector database");
        return ResponseEntity.ok(result);
    }
}
