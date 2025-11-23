package com.sns.dto.report;

import com.sns.entity.Report.ReportStatus;
import com.sns.entity.Report.ReportType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class ReportDto {

    @Getter
    @Setter
    public static class CreateReportRequest {
        private Long reporterId;
        private Long reportedUserId;
        private Long reportedPostId;
        private Long reportedCommentId;
        private ReportType reportType;
        private String reason;
        private String description;
    }

    @Getter
    @Setter
    public static class UpdateStatusRequest {
        private ReportStatus status;
    }

    @Getter
    @Builder
    public static class ReportResponse {
        private Long id;
        private Long reporterId;
        private Long reportedUserId;
        private Long reportedPostId;
        private Long reportedCommentId;
        private ReportType reportType;
        private ReportStatus status;
    }
}

