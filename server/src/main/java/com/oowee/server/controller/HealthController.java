package com.oowee.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.TreeMap;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, String> healthCheck() {
        Map<String, String> status = new TreeMap<>();
        status.put("status", "ok");
        status.put("message", "Oowee Server is running!");
        status.put("version", "0.0.1");

        return status;
    }
}
