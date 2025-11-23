package com.sns.service;

import com.sns.common.ErrorCode;
import com.sns.common.SnsException;
import com.sns.dto.report.ReportDto.CreateReportRequest;
import com.sns.dto.report.ReportDto.ReportResponse;
import com.sns.dto.report.ReportDto.UpdateStatusRequest;
import com.sns.entity.Comment;
import com.sns.entity.Post;
import com.sns.entity.Report;
import com.sns.entity.User;
import com.sns.repository.CommentRepository;
import com.sns.repository.PostRepository;
import com.sns.repository.ReportRepository;
import com.sns.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Transactional
    public ReportResponse createReport(CreateReportRequest request) {
        User reporter = userRepository.findById(request.getReporterId())
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));

        Report.ReportType type = request.getReportType();
        if (type == null) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "신고 유형이 필요합니다.");
        }

        Report report = Report.builder()
                .reporter(reporter)
                .reportType(type)
                .reason(request.getReason())
                .description(request.getDescription())
                .build();

        if (request.getReportedUserId() != null) {
            report.setReportedUser(userRepository.findById(request.getReportedUserId())
                    .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND)));
        }
        if (request.getReportedPostId() != null) {
            report.setReportedPost(postRepository.findById(request.getReportedPostId())
                    .orElseThrow(() -> new SnsException(ErrorCode.POST_NOT_FOUND)));
        }
        if (request.getReportedCommentId() != null) {
            report.setReportedComment(commentRepository.findById(request.getReportedCommentId())
                    .orElseThrow(() -> new SnsException(ErrorCode.COMMENT_NOT_FOUND)));
        }

        if (report.getReportedUser() == null && report.getReportedPost() == null && report.getReportedComment() == null) {
            throw new SnsException(ErrorCode.INVALID_REQUEST, "신고 대상이 필요합니다.");
        }

        return toResponse(reportRepository.save(report));
    }

    @Transactional
    public ReportResponse updateStatus(Long reportId, UpdateStatusRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new SnsException(ErrorCode.REPORT_NOT_FOUND));
        report.setStatus(request.getStatus());
        return toResponse(report);
    }

    @Transactional(readOnly = true)
    public List<ReportResponse> getReportsByReporter(Long reporterId) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new SnsException(ErrorCode.USER_NOT_FOUND));
        return reportRepository.findAllByReporter(reporter)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ReportResponse toResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .reporterId(report.getReporter().getId())
                .reportedUserId(report.getReportedUser() != null ? report.getReportedUser().getId() : null)
                .reportedPostId(report.getReportedPost() != null ? report.getReportedPost().getId() : null)
                .reportedCommentId(report.getReportedComment() != null ? report.getReportedComment().getId() : null)
                .reportType(report.getReportType())
                .status(report.getStatus())
                .build();
    }
}

