import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { reportAPI } from '../services/api'
import './Reports.css'

function Reports() {
  const currentUserId = localStorage.getItem('userId') || '1'
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getReports(currentUserId)
      if (response.data) {
        setReports(response.data)
      }
    } catch (error) {
      console.error('신고 목록 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'PENDING': { text: '대기중', class: 'status-pending' },
      'REVIEWING': { text: '검토중', class: 'status-reviewing' },
      'RESOLVED': { text: '처리완료', class: 'status-resolved' },
      'REJECTED': { text: '거부됨', class: 'status-rejected' }
    }
    const statusInfo = statusMap[status] || { text: status, class: 'status-default' }
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}</span>
  }

  const getTypeText = (type) => {
    const typeMap = {
      'SPAM': '스팸',
      'INAPPROPRIATE_CONTENT': '부적절한 콘텐츠',
      'HARASSMENT': '괴롭힘',
      'COPYRIGHT': '저작권 침해',
      'OTHER': '기타'
    }
    return typeMap[type] || type
  }

  if (loading) {
    return <div className="loading">로딩 중...</div>
  }

  return (
    <div className="reports">
      <div className="reports-container">
        <h2>내 신고 내역</h2>
        {reports.length === 0 ? (
          <div className="reports-empty">
            <p>신고 내역이 없습니다.</p>
          </div>
        ) : (
          <div className="reports-list">
            {reports.map(report => (
              <div key={report.id} className="report-item">
                <div className="report-header">
                  <div className="report-type">{getTypeText(report.reportType)}</div>
                  {getStatusBadge(report.status)}
                </div>
                <div className="report-content">
                  {report.reason && (
                    <div className="report-reason">
                      <strong>사유:</strong> {report.reason}
                    </div>
                  )}
                  {report.description && (
                    <div className="report-description">
                      {report.description}
                    </div>
                  )}
                  <div className="report-targets">
                    {report.reportedUserId && (
                      <Link to={`/app/profile/${report.reportedUserId}`} className="report-target-link">
                        사용자 신고
                      </Link>
                    )}
                    {report.reportedPostId && (
                      <Link to={`/app/post/${report.reportedPostId}`} className="report-target-link">
                        게시물 신고
                      </Link>
                    )}
                    {report.reportedCommentId && (
                      <span className="report-target-link">댓글 신고</span>
                    )}
                  </div>
                </div>
                <div className="report-footer">
                  <span className="report-date">
                    {new Date(report.createdAt).toLocaleString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Reports

