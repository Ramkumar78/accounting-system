package com.accounting.controller;

import com.accounting.dto.DashboardDTO;
import com.accounting.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final ReportService reportService;

    @GetMapping({"/dashboard", "/api/dashboard"})
    public ResponseEntity<DashboardDTO> dashboard() {
        DashboardDTO dashboard = reportService.generateDashboard();
        return ResponseEntity.ok(dashboard);
    }
}