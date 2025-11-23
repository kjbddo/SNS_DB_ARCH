package com.sns.controller;

import com.sns.common.ApiResponse;
import com.sns.dto.report.ReportDto.CreateReportRequest;
import com.sns.dto.report.ReportDto.ReportResponse;
import com.sns.dto.report.ReportDto.UpdateStatusRequest;
import com.sns.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ApiResponse<ReportResponse> createReport(@RequestBody CreateReportRequest request) {
        return ApiResponse.ok(reportService.createReport(request));
    }

    @PutMapping("/{reportId}/status")
    public ApiResponse<ReportResponse> updateStatus(@PathVariable Long reportId,
                                                    @RequestBody UpdateStatusRequest request) {
        return ApiResponse.ok(reportService.updateStatus(reportId, request));
    }

    @GetMapping("/reporter/{reporterId}")
    public ApiResponse<List<ReportResponse>> getReports(@PathVariable Long reporterId) {
        return ApiResponse.ok(reportService.getReportsByReporter(reporterId));
    }
}

