package com.dot.tour_info_service_server.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.TreeMap;

@RestController
@RequiredArgsConstructor
public class HealthCheckController {
    @Value("${server.env}")
    private String env;
    @Value("${server.port}")
    private String serverPort;
    @Value("${server.serverAddress}")
    private String serverAddress;
    @Value("${serverName}")
    private String serverName;

    @GetMapping("/hc")
    public ResponseEntity<?> healthCheck() {
        Map<String, String> responsData = new TreeMap<>();
        responsData.put("serverName", serverName);
        responsData.put("serverAddress", serverAddress);
        responsData.put("serverPort", serverPort);
        responsData.put("env", env);

        return ResponseEntity.ok(responsData);
    }

    @GetMapping("/env")
    public ResponseEntity<?> getEnv() {
        return ResponseEntity.ok(env);
    }
}
